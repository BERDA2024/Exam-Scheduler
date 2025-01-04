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
    public class GroupController(ApplicationDbContext context, UserManager<User> userManager, RolesService userRoleService) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly ApplicationDbContext _context = context;
        private readonly RolesService _userRoleService = userRoleService;

        // GET: api/Group
        [HttpGet]
        [Authorize(Roles = "FacultyAdmin,Secretary")]
        public async Task<ActionResult<IEnumerable<GroupModel>>> GetGroups()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if (userId == null) return BadRequest(new { message = "User not found" });

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null) return BadRequest(new { message = "User not found" });

                var facultyId = _userRoleService.GetFacultyIdByRole(user).Result;

                if (facultyId == null) return BadRequest(new { message = "User not in a faculty" });

                var groups = await _context.Group.ToListAsync();

                var groupsModels = new List<GroupModel>();

                foreach (var group in groups)
                {
                    var department = await _context.Department.FirstOrDefaultAsync(d => d.Id == group.DepartmentId);

                    if (department == null || department.FacultyId != facultyId) continue;

                    groupsModels.Add(new GroupModel
                    {
                        Id = group.Id,
                        DepartmentName = department.ShortName,
                        GroupName = group.GroupName,
                        StudyYear = group.StudyYear
                    });
                }

                return Ok(groupsModels);
            }
            catch (Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }

        // GET: api/Group/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "FacultyAdmin,Secretary")]
        public async Task<ActionResult<GroupModel>> GetGroup(int id)
        {
            var group = await _context.Group.FindAsync(id);

            if (group == null) return NotFound(new { message = "Group not found." });

            var department = await _context.Department.FirstOrDefaultAsync(d => d.Id == id);

            if (department == null) return BadRequest(new { message = "Department not found" });

            var groupModel = new GroupModel
            {
                Id = group.Id,
                DepartmentName = department.ShortName,
                GroupName = group.GroupName,
                StudyYear = group.StudyYear
            };

            return Ok(groupModel);
        }

        // POST: api/Group
        [HttpPost]
        [Authorize(Roles = "FacultyAdmin,Secretary")]
        public async Task<ActionResult<GroupModel>> CreateGroup(GroupModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var department = await _context.Department.FirstOrDefaultAsync(d => d.ShortName == model.DepartmentName);

            if (department == null) return BadRequest(new { message = "Department not found" });

            var group = new Group
            {
                DepartmentId = department.Id,
                GroupName = model.GroupName,
                StudyYear = model.StudyYear
            };

            _context.Group.Add(group);
            await _context.SaveChangesAsync();

            model.Id = group.Id;

            return CreatedAtAction(nameof(GetGroup), new { id = group.Id }, model);
        }

        // PUT: api/Group/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "FacultyAdmin,Secretary")]
        public async Task<IActionResult> UpdateGroup(int id, GroupModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var group = await _context.Group.FindAsync(id);
            if (group == null) return NotFound(new { message = "Group not found." });


            var department = await _context.Department.FirstOrDefaultAsync(d => d.ShortName == model.DepartmentName);

            if (department == null) return BadRequest(new { message = "Department not found" });

            group.DepartmentId = department.Id;
            group.GroupName = model.GroupName;
            group.StudyYear = model.StudyYear;

            _context.Group.Update(group);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Group/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "FacultyAdmin,Secretary")]
        public async Task<IActionResult> DeleteGroup(int id)
        {
            var group = await _context.Group.FindAsync(id);

            if (group == null) return NotFound(new { message = "Group not found." });

            _context.Group.Remove(group);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
