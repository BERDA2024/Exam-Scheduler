using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using ExamScheduler.Server.Source.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ExamScheduler.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubgroupController(ApplicationDbContext context, UserManager<User> userManager, RolesService userRoleService) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly ApplicationDbContext _context = context;
        private readonly RolesService _userRoleService = userRoleService;

        // GET: api/Subgroup
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubgroupModel>>> GetSubgroups()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if (userId == null) return BadRequest(new { message = "User not found" });

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null) return BadRequest(new { message = "User not found" });

                var facultyId = _userRoleService.GetFacultyIdByRole(user).Result;

                if (facultyId == null) return BadRequest(new { message = "User not in a faculty" });

                var departmentsIds = await _context.Department.Where(d => d.FacultyId == facultyId).Select(d => d.Id).ToListAsync();

                var subgroups = await _context.Subgroup.ToListAsync();

                var subgroupsModels = new List<SubgroupModel>();

                foreach (var subgroup in subgroups)
                {
                    var group = await _context.Group.FirstOrDefaultAsync(g => g.Id == subgroup.GroupId);

                    if (group == null || !departmentsIds.Contains(group.DepartmentId)) continue;

                    subgroupsModels.Add(new SubgroupModel
                    {
                        Id = subgroup.Id,
                        GroupName = group.GroupName,
                        SubgroupIndex = subgroup.SubgroupIndex,
                        FullName = group.GroupName + subgroup.SubgroupIndex
                    });
                }

                return Ok(subgroupsModels);
            }
            catch (Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }

        // GET: api/Subgroup/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<SubgroupModel>> GetSubgroup(int id)
        {
            var subgroup = await _context.Subgroup.FindAsync(id);

            if (subgroup == null) return NotFound(new { message = "Subgroup not found." });

            var group = await _context.Group.FirstOrDefaultAsync(g => g.Id == subgroup.GroupId);

            if (group == null) return NotFound(new { message = "Group not found." });

            var subgroupModel = new SubgroupModel
            {
                Id = subgroup.Id,
                GroupName = group.GroupName,
                SubgroupIndex = subgroup.SubgroupIndex,
                FullName = group.GroupName + subgroup.SubgroupIndex
            };

            return Ok(subgroupModel);
        }

        // POST: api/Subgroup
        [HttpPost]
        public async Task<ActionResult<SubgroupModel>> CreateSubgroup(SubgroupModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var group = await _context.Group.FirstOrDefaultAsync(g => g.GroupName == model.GroupName);

            if (group == null) return NotFound(new { message = "Group not found" });

            var subgroup = new Subgroup
            {
                GroupId = group.Id,
                SubgroupIndex = model.SubgroupIndex
            };

            _context.Subgroup.Add(subgroup);
            await _context.SaveChangesAsync();

            model.Id = subgroup.Id;

            return CreatedAtAction(nameof(GetSubgroup), new { id = subgroup.Id }, model);
        }

        // PUT: api/Subgroup/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubgroup(int id, SubgroupModel model)
        {

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var group = await _context.Group.FirstOrDefaultAsync(g => g.GroupName == model.GroupName);

            if (group == null) return NotFound(new { message = "Group not found" });

            var subgroup = await _context.Subgroup.FindAsync(id);

            if (subgroup == null) return NotFound(new { message = "Subgroup not found" });

            subgroup.GroupId = group.Id;
            subgroup.SubgroupIndex = model.SubgroupIndex;

            _context.Subgroup.Update(subgroup);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Subgroup/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubgroup(int id)
        {
            var subgroup = await _context.Subgroup.FindAsync(id);

            if (subgroup == null) return NotFound(new { message = "Subroup not found." });

            _context.Subgroup.Remove(subgroup);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
