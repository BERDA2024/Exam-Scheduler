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
    public class StudentController(ApplicationDbContext context, UserManager<User> userManager, RolesService userRoleService) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly ApplicationDbContext _context = context;
        private readonly RolesService _userRoleService = userRoleService;


        // GET: api/Student
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<StudentModel>>> GetAllStudents()
        {
            var students = await _context.Student
                .Select(s => new StudentModel
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    SubgroupID = s.SubgroupID
                })
                .ToListAsync();

            return Ok(students);
        }

        // GET: api/Student
        [HttpGet]
        [Authorize(Roles = "Admin,FacultyAdmin,Secretary")]
        public async Task<ActionResult<IEnumerable<SelectStudentModel>>> GetStudents()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

            if (userId == null) return BadRequest(new { message = "User not found" });

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) return BadRequest(new { message = "User not found" });

            var facultyId = _userRoleService.GetFacultyIdByRole(user).Result;

            if (facultyId == null) return BadRequest(new { message = "User not in a faculty" });

            var students = await _context.Student
                .ToListAsync();

            var selectStudents = new List<SelectStudentModel>();

            foreach (var student in students)
            {
                // Fetch user for this student
                var studentUser = _context.Users.FirstOrDefault(u => u.Id == student.UserId);

                if (studentUser == null || student.FacultyId != facultyId) continue; // Skip if user is not found

                // Initialize group and subgroup as null
                Group? group = null;
                Subgroup? subgroup = null;

                // If SubgroupID is not null, try to get the subgroup and associated group
                if (student.SubgroupID != null)
                {
                    subgroup = _context.Subgroup.FirstOrDefault(s => s.Id == student.SubgroupID);
                    if (subgroup != null)
                    {
                        group = _context.Group.FirstOrDefault(s => s.Id == subgroup.GroupId);
                    }
                }

                // Add valid student to the list
                selectStudents.Add(new SelectStudentModel
                {
                    Id = student.Id,
                    FullName = studentUser.FirstName + " " + studentUser.LastName,
                    Email = studentUser.Email,
                    FullGroupName = group?.GroupName + subgroup?.SubgroupIndex
                });
            }

            return Ok(selectStudents);
        }

        // GET: api/Student/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentModel>> GetStudent(int id)
        {
            var student = await _context.Student.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            var studentModel = new StudentModel
            {
                Id = student.Id,
                UserId = student.UserId,
                SubgroupID = student.SubgroupID
            };

            return Ok(studentModel);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] SelectStudentModel updatedStudent)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var student = await _context.Student.FindAsync(id);

            if (student == null) return NotFound(new { message = "Student Not Found." });

            var departmentsIds = await _context.Department.Where(d => d.FacultyId == student.FacultyId).Select(d => d.Id).ToListAsync();

            var fullGroupName = updatedStudent.FullGroupName;

            if (string.IsNullOrEmpty(fullGroupName) || fullGroupName.Length <= 1)
                return BadRequest(new { message = "FullGroupName should contain both GroupName and SubgroupIndex." });

            var groupName = fullGroupName[..^1];
            var subgroupIndex = fullGroupName[^1..];
            var group = await _context.Group.FirstOrDefaultAsync(g => g.GroupName == groupName && departmentsIds.Contains(g.DepartmentId));

            if (group == null) return NotFound(new { message = "Group Not Found." });

            var subgroupId = await _context.Subgroup.FirstOrDefaultAsync(s => s.GroupId == group.Id && s.SubgroupIndex == subgroupIndex);

            if (subgroupId == null) return NotFound(new { message = "Subgroup Not Found." });

            student.SubgroupID = subgroupId?.Id;
            _context.Student.Update(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
