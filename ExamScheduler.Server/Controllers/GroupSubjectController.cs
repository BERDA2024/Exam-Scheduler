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
    public class GroupSubjectController(ApplicationDbContext context, UserManager<User> userManager, RolesService userRoleService) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly ApplicationDbContext _context = context;
        private readonly RolesService _userRoleService = userRoleService;

        // GET: api/GroupSubject
        [HttpGet()]
        public async Task<ActionResult<IEnumerable<GroupSubjectModel>>> GetGroupSubjects()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if (userId == null) return BadRequest(new { message = "User not found" });

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null) return BadRequest(new { message = "User not found" });

                var facultyId = await _userRoleService.GetFacultyIdByRole(user);

                if (facultyId == null) return BadRequest(new { message = "User not in a faculty" });

                var departmentsIds = await _context.Department.Where(d => d.FacultyId == facultyId).Select(d => d.Id).ToListAsync();

                if (departmentsIds.Count == 0) return NotFound(new { message = "Departments not found." });

                var groupSubjects = await _context.GroupSubject.ToListAsync();

                var groupSubjectsModels = new List<GroupSubjectModel>();

                foreach (var groupSubject in groupSubjects)
                {
                    var subject = await _context.Subject.FirstOrDefaultAsync(s => s.Id == groupSubject.SubjectID);

                    if (subject == null || !departmentsIds.Contains(subject.DepartmentId)) continue;

                    var group = await _context.Group.FirstOrDefaultAsync(g => g.Id == groupSubject.GroupID);

                    if (group == null || !departmentsIds.Contains(group.DepartmentId)) continue;

                    groupSubjectsModels.Add(new GroupSubjectModel
                    {
                        Id = groupSubject.Id,
                        GroupName = group.GroupName,
                        SubjectName = subject.ShortName
                    });
                }
                return Ok(groupSubjectsModels);
            }
            catch (Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }

        // GET: api/GroupSubject/student
        [HttpGet("student")]
        [Authorize(Roles = "StudentGroupLeader,Student")]
        public async Task<ActionResult<IEnumerable<GroupSubjectModel>>> GetGroupSubjectsByGroup()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if (userId == null) return BadRequest(new { message = "User not found" });

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null) return BadRequest(new { message = "User not found" });

                var student = await _context.Student.FirstOrDefaultAsync(s => s.UserId == userId);

                if (student == null) return NotFound(new { message = "Student not found" });

                var subgroup = await _context.Subgroup.FirstOrDefaultAsync(sg => sg.Id == student.SubgroupID);

                if (subgroup == null) return NotFound(new { message = "Subgroup not found" });

                var group = await _context.Group.FirstOrDefaultAsync(g => g.Id == subgroup.GroupId);

                if (group == null) return NotFound(new { message = "Group not found" });

                var groupSubjects = await _context.GroupSubject.Where(gs => gs.GroupID == group.Id).ToListAsync();

                var groupSubjectsModels = new List<GroupSubjectModel>();

                foreach (var groupSubject in groupSubjects)
                {
                    var subject = await _context.Subject.FirstOrDefaultAsync(s => s.Id == groupSubject.SubjectID);

                    if (subject == null) continue;

                    groupSubjectsModels.Add(new GroupSubjectModel
                    {
                        Id = groupSubject.Id,
                        GroupName = group.GroupName,
                        SubjectName = subject.ShortName
                    });
                }
                return Ok(groupSubjectsModels);
            }
            catch (Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }

        // GET: api/GroupSubject/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<GroupSubjectModel>> GetGroupSubject(int id)
        {
            try
            {
                var groupSubject = await _context.GroupSubject.FindAsync(id);

                if (groupSubject == null) return NotFound(new { message = "Group Subject not found." });

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if (userId == null) return NotFound(new { message = "User not found" });

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null) return NotFound(new { message = "User not found" });

                var facultyId = await _userRoleService.GetFacultyIdByRole(user);

                if (facultyId == null) return NotFound(new { message = "User not in a faculty" });

                var departmentsIds = await _context.Department.Where(d => d.FacultyId == facultyId).Select(d => d.Id).ToListAsync();

                if (departmentsIds.Count == 0) return NotFound(new { message = "Departments not found." });

                var subject = await _context.Subject.FirstOrDefaultAsync(s => s.Id == groupSubject.SubjectID);

                if (subject == null || !departmentsIds.Contains(subject.DepartmentId)) return NotFound(new { message = "Subject not found." });

                var group = await _context.Group.FirstOrDefaultAsync(g => g.Id == groupSubject.GroupID);

                if (group == null || !departmentsIds.Contains(group.DepartmentId)) return NotFound(new { message = "Group not found." });

                var groupSubjectModel = new GroupSubjectModel
                {
                    Id = groupSubject.Id,
                    GroupName = group.GroupName,
                    SubjectName = subject.ShortName
                };

                return Ok(groupSubjectModel);
            }
            catch (Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }

        // POST: api/GroupSubject
        [HttpPost]
        [Authorize(Roles = "FacultyAdmin,Secretary")]
        public async Task<ActionResult<GroupSubjectModel>> CreateGroupSubject(GroupSubjectModel model)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if (userId == null) return NotFound(new { message = "User not found" });

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null) return NotFound(new { message = "User not found" });

                var facultyId = await _userRoleService.GetFacultyIdByRole(user);

                if (facultyId == null) return NotFound(new { message = "User not in a faculty" });

                var departmentsIds = await _context.Department.Where(d => d.FacultyId == facultyId).Select(d => d.Id).ToListAsync();

                if (departmentsIds.Count == 0) return NotFound(new { message = "Departments not found." });

                var subject = await _context.Subject.FirstOrDefaultAsync(s => s.ShortName.ToLower().Equals(model.SubjectName.ToLower()) && departmentsIds.Contains(s.DepartmentId));

                if (subject == null) return NotFound(new { message = "Subject not found." });

                var group = await _context.Group.FirstOrDefaultAsync(g => g.GroupName.ToLower().Equals(model.GroupName.ToLower()) && departmentsIds.Contains(g.DepartmentId));

                if (group == null || !departmentsIds.Contains(group.DepartmentId)) return NotFound(new { message = "Group not found." });

                var groupSubject = new GroupSubject
                {
                    SubjectID = subject.Id,
                    GroupID = group.Id
                };

                _context.GroupSubject.Add(groupSubject);
                await _context.SaveChangesAsync();

                model.Id = groupSubject.Id;

                return CreatedAtAction(nameof(GetGroupSubject), new { id = groupSubject.Id }, model);
            }
            catch (Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }

        // PUT: api/GroupSubject/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "FacultyAdmin,Secretary")]
        public async Task<IActionResult> UpdateGroupSubject(int id, GroupSubjectModel model)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var groupSubject = await _context.GroupSubject.FindAsync(id);

                if (groupSubject == null) return NotFound(new { message = "Group Subject not found" });

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if (userId == null) return NotFound(new { message = "User not found" });

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null) return NotFound(new { message = "User not found" });

                var facultyId = await _userRoleService.GetFacultyIdByRole(user);

                if (facultyId == null) return NotFound(new { message = "User not in a faculty" });

                var departmentsIds = await _context.Department.Where(d => d.FacultyId == facultyId).Select(d => d.Id).ToListAsync();

                if (departmentsIds.Count == 0) return NotFound(new { message = "Departments not found." });

                var subject = await _context.Subject.FirstOrDefaultAsync(s => s.ShortName.ToLower().Equals(model.SubjectName.ToLower()) && departmentsIds.Contains(s.DepartmentId));

                if (subject == null) return NotFound(new { message = "Subject not found." });

                var group = await _context.Group.FirstOrDefaultAsync(g => g.GroupName.ToLower().Equals(model.GroupName.ToLower()) && departmentsIds.Contains(g.DepartmentId));

                if (group == null || !departmentsIds.Contains(group.DepartmentId)) return NotFound(new { message = "Group not found." });


                groupSubject.SubjectID = subject.Id;
                groupSubject.GroupID = group.Id;

                _context.GroupSubject.Update(groupSubject);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }

        // DELETE: api/GroupSubject/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "FacultyAdmin,Secretary")]
        public async Task<IActionResult> DeleteGroupSubject(int id)
        {
            var groupSubject = await _context.GroupSubject.FindAsync(id);

            if (groupSubject == null) return NotFound();

            _context.GroupSubject.Remove(groupSubject);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
