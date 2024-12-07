using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GroupController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Group
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroupModel>>> GetGroups()
        {
            var groups = await _context.Group
                .Select(g => new GroupModel
                {
                    Id = g.Id,
                    DepartmentId = g.DepartmentId,
                    GroupName = g.GroupName,
                    StudyYear = g.StudyYear
                })
                .ToListAsync();

            return Ok(groups);
        }

        // GET: api/Group/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<GroupModel>> GetGroup(int id)
        {
            var group = await _context.Group.FindAsync(id);

            if (group == null)
            {
                return NotFound();
            }

            var groupModel = new GroupModel
            {
                Id = group.Id,
                DepartmentId = group.DepartmentId,
                GroupName = group.GroupName,
                StudyYear = group.StudyYear
            };

            return Ok(groupModel);
        }

        // POST: api/Group
        [HttpPost]
        public async Task<ActionResult<GroupModel>> CreateGroup(GroupModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var group = new Group
            {
                DepartmentId = model.DepartmentId,
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
        public async Task<IActionResult> UpdateGroup(int id, GroupModel model)
        {
            if (id != model.Id)
            {
                return BadRequest("ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var group = await _context.Group.FindAsync(id);
            if (group == null)
            {
                return NotFound();
            }

            group.DepartmentId = model.DepartmentId;
            group.GroupName = model.GroupName;
            group.StudyYear = model.StudyYear;

            _context.Group.Update(group);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Group/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroup(int id)
        {
            var group = await _context.Group.FindAsync(id);
            if (group == null)
            {
                return NotFound();
            }

            _context.Group.Remove(group);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
