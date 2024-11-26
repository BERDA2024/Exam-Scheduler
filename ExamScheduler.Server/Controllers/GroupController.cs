using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Controllers
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

        // GET: api/group
        [HttpGet]
        public async Task<IActionResult> GetAllGroups()
        {
            var groups = await _context.Group.ToListAsync();
            return Ok(groups);
        }

        // GET: api/group/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGroupById(int id)
        {
            var group = await _context.Group.FindAsync(id);

            if (group == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            return Ok(group);
        }

        // POST: api/group
        [HttpPost]
        public async Task<IActionResult> CreateGroup([FromBody] Group group)
        {
            if (group == null)
            {
                return BadRequest(new { message = "Invalid group data" });
            }

            _context.Group.Add(group);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGroupById), new { id = group.Id }, group);
        }

        // PUT: api/group/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGroup(int id, [FromBody] Group updatedGroup)
        {
            if (id != updatedGroup.Id)
            {
                return BadRequest(new { message = "ID mismatch" });
            }

            var existingGroup = await _context.Group.FindAsync(id);

            if (existingGroup == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            // Update group properties
            existingGroup.GroupName = updatedGroup.GroupName;
            existingGroup.StudyYear = updatedGroup.StudyYear;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GroupExists(id))
                {
                    return NotFound(new { message = "Group not found" });
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/group/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroup(int id)
        {
            var group = await _context.Group.FindAsync(id);

            if (group == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            _context.Group.Remove(group);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GroupExists(int id)
        {
            return _context.Group.Any(g => g.Id == id);
        }
    }
}
