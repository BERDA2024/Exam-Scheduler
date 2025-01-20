using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using ExamScheduler.Server.Source.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ExamScheduler.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubjectController(ApplicationDbContext context, UserManager<User> userManager, RolesService userRoleService, NotificationService notificationService) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly ApplicationDbContext _context = context;
        private readonly RolesService _userRoleService = userRoleService;
        private readonly NotificationService _notificationService = notificationService;
        // GET: api/Subject
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubjectModel>>> GetSubjects()
        {
            var subjects = await _context.Subject
                .Select(s => new SubjectModel
                {
                    Id = s.Id,
                    LongName = s.LongName,
                    ShortName = s.ShortName,
                    ProfessorID = s.ProfessorID,
                    DepartmentId = s.DepartmentId,
                    ExamDuration = s.ExamDuration,
                    ExamType = s.ExamType
                })
                .ToListAsync();

            return Ok(subjects);
        }

        // GET: api/Subject
        [HttpGet("group")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<SubjectModel>>> GetSubjectsByGroup()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if (userId == null) return BadRequest(new { message = "User not found" });

                var student = await _context.Student.FirstOrDefaultAsync(s => s.UserId == userId);

                if (student == null) return NotFound(new { message = "Student not found" });

                var subgroup = await _context.Subgroup.FirstOrDefaultAsync(sg => sg.Id == student.SubgroupID);

                if (subgroup == null) return BadRequest(new { message = "Student not in a group" });

                var groupSubjects = await _context.GroupSubject
                    .Where(gs => gs.GroupID == subgroup.GroupId)
                    .Select(s => s.SubjectID)
                    .ToListAsync();

                var subjects = await _context.Subject
                    .Where(s => groupSubjects.Contains(s.Id))
                    .Select(s => new SubjectModel
                    {
                        Id = s.Id,
                        LongName = s.LongName,
                        ShortName = s.ShortName,
                        ProfessorID = s.ProfessorID,
                        DepartmentId = s.DepartmentId,
                        ExamDuration = s.ExamDuration,
                        ExamType = s.ExamType
                    })
                    .ToListAsync();

                return Ok(subjects);
            }
            catch (Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }
        // GET: api/Subject/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<SubjectModel>> GetSubject(int id)
        {
            var subject = await _context.Subject.FindAsync(id);

            if (subject == null)
            {
                return NotFound();
            }

            var subjectModel = new SubjectModel
            {
                Id = subject.Id,
                LongName = subject.LongName,
                ShortName = subject.ShortName,
                ProfessorID = subject.ProfessorID,
                DepartmentId = subject.DepartmentId,
                ExamDuration = subject.ExamDuration,
                ExamType = subject.ExamType
            };

            return Ok(subjectModel);
        }

        // POST: api/Subject
        [HttpPost]
        public async Task<ActionResult<SubjectModel>> CreateSubject(SubjectModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var subject = new Subject
            {
                LongName = model.LongName,
                ShortName = model.ShortName,
                ProfessorID = model.ProfessorID,
                DepartmentId = model.DepartmentId,
                ExamDuration = model.ExamDuration,
                ExamType = model.ExamType
            };

            _context.Subject.Add(subject);
            await _context.SaveChangesAsync();
            model.Id = subject.Id;

            return CreatedAtAction(nameof(GetSubject), new { id = subject.Id }, model);
        }

        // PUT: api/Subject/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubject(int id, SubjectModel model)
        {
            if (id != model.Id)
            {
                return BadRequest("ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var subject = await _context.Subject.FindAsync(id);
            if (subject == null)
            {
                return NotFound();
            }

            subject.LongName = model.LongName;
            subject.ShortName = model.ShortName;
            subject.ProfessorID = model.ProfessorID;
            subject.DepartmentId = model.DepartmentId;
            subject.ExamDuration = model.ExamDuration;
            subject.ExamType = model.ExamType;

            _context.Subject.Update(subject);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Subject/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            var subject = await _context.Subject.FindAsync(id);
            if (subject == null)
            {
                return NotFound();
            }

            _context.Subject.Remove(subject);
            await _context.SaveChangesAsync();

            var professor = await _context.Professor.FindAsync(subject.ProfessorID);

            if (professor != null)
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if (userId == null) return NoContent();

                await _notificationService.AddNotificationAsync(
                    "One of your subject was edited by the admin.",
                    $"The subject \"{subject.LongName}\" was edited",
                    userId,
                    professor.UserId);
            }

            return NoContent();
        }

        // GET: api/Subject/add
        [HttpGet("add")]
        public async Task<ActionResult<IEnumerable<AddSubjectModel>>> GetFilteredSubjects()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if (userId == null) return BadRequest(new { message = "User not found" });

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null) return BadRequest(new { message = "User not found" });

                var facultyId = _userRoleService.GetFacultyIdByRole(user).Result;

                if (facultyId == null) return BadRequest(new { message = "User not in a faculty" });

                var subjects = await _context.Subject.ToListAsync();

                var subjectsModels = new List<AddSubjectModel>();

                foreach (var subject in subjects)
                {
                    var department = await _context.Department.FirstOrDefaultAsync(d => d.Id == subject.DepartmentId);

                    if (department == null || department.FacultyId != facultyId) continue;

                    var professor = await _context.Professor.FirstOrDefaultAsync(d => d.Id == subject.ProfessorID);

                    if (professor == null) continue;

                    var userProfessor = await _context.Users.FirstOrDefaultAsync(d => d.Id == professor.UserId);

                    if (userProfessor == null) continue;

                    subjectsModels.Add(new AddSubjectModel
                    {
                        Id = subject.Id,
                        ShortName = subject.ShortName,
                        LongName = subject.LongName,
                        DepartmentShortName = department.ShortName,
                        ProfessorName = userProfessor.FirstName + " " + userProfessor.LastName,
                        ExamType = subject.ExamType,
                        ExamDuration = subject.ExamDuration,
                    });
                }

                return Ok(subjectsModels);
            }
            catch (Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }

        // POST: api/Subject/add
        [HttpPost("add")]
        [Authorize(Roles = "FacultyAdmin")]
        public async Task<ActionResult<SubjectModel>> CreateAddSubject(AddSubjectModel model)
        {
            if (!ModelState.IsValid) return BadRequest(new { message = "Bad model" });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

            if (userId == null) return BadRequest(new { message = "User not found" });

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) return BadRequest(new { message = "User not found" });

            var facultyId = await _userRoleService.GetFacultyIdByRole(user);

            if (facultyId == null) return BadRequest(new { message = "Faculty not found" });

            var department = await _context.Department.FirstOrDefaultAsync(d => d.ShortName.Equals(model.DepartmentShortName) && d.FacultyId == facultyId);

            if (department == null) return BadRequest(new { message = "Department not found" });

            var professorUser = await _context.Users.FirstOrDefaultAsync(u => (u.FirstName + " " + u.LastName).Contains(model.ProfessorName) || (u.LastName + " " + u.FirstName).Contains(model.ProfessorName));

            if (professorUser == null) return BadRequest(new { message = "User not found" });

            var professor = await _context.Professor.FirstOrDefaultAsync(d => d.UserId == professorUser.Id);

            if (professor == null) return BadRequest(new { message = "Professor not found" });

            var subject = new Subject
            {
                LongName = model.LongName,
                ShortName = model.ShortName,
                ProfessorID = professor.Id,
                DepartmentId = department.Id,
                ExamType = model.ExamType,
                ExamDuration = model.ExamDuration,
            };

            _context.Subject.Add(subject);
            await _context.SaveChangesAsync();

            await _notificationService.AddNotificationAsync("A subject was assigned to you.", $"The subject \"{model.LongName}\" was assigned to you", userId, professor.UserId);

            model.Id = subject.Id;

            return CreatedAtAction(nameof(GetSubject), new { id = subject.Id }, model);
        }

        // PUT: api/Subject/add/{id}
        [HttpPut("add/{id}")]
        [Authorize(Roles = "FacultyAdmin")]
        public async Task<IActionResult> UpdateAddSubject(int id, AddSubjectModel model)
        {
            if (!ModelState.IsValid) return BadRequest(new { message = ModelState });

            var subject = await _context.Subject.FindAsync(id);

            if (subject == null) return NotFound(new { message = "Subject not found" });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

            if (userId == null) return BadRequest(new { message = "User not found" });

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) return BadRequest(new { message = "User not found" });

            var facultyId = _userRoleService.GetFacultyIdByRole(user).Result;

            if (facultyId == null) return BadRequest(new { message = "Faculty not found" });

            var department = await _context.Department.FirstOrDefaultAsync(d => d.ShortName.Equals(model.DepartmentShortName) && d.FacultyId == facultyId);

            if (department == null) return BadRequest(new { message = "Department not found" });

            var professorUser = await _context.Users.FirstOrDefaultAsync(u => (u.FirstName + " " + u.LastName).Contains(model.ProfessorName) || (u.LastName + " " + u.FirstName).Contains(model.ProfessorName));

            if (professorUser == null) return BadRequest(new { message = "User not found" });

            var professor = await _context.Professor.FirstOrDefaultAsync(d => d.UserId == professorUser.Id);

            if (professor == null) return BadRequest(new { message = "Professor not found" });
            subject.LongName = model.LongName;
            subject.ShortName = model.ShortName;
            subject.ProfessorID = professor.Id;
            subject.DepartmentId = department.Id;
            subject.ExamDuration = model.ExamDuration;
            subject.ExamType = model.ExamType;

            _context.Subject.Update(subject);
            await _context.SaveChangesAsync();

            await _notificationService.AddNotificationAsync("One of your subject was edited by the admin.", $"The subject \"{model.LongName}\" was edited", userId, professor.UserId);

            return NoContent();
        }

    }
}
