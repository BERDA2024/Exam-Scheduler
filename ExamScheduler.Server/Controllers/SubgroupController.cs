using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubgroupController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SubgroupController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Subgroup
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubgroupModel>>> GetSubgroups()
        {
            var subgroups = await _context.Subgroup
                .ToListAsync();

            return Ok(subgroups);
        }

        // GET: api/Subgroup/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<SubgroupModel>> GetSubgroup(int id)
        {
            var subgroup = await _context.Subgroup.FindAsync(id);

            if (subgroup == null)
            {
                return NotFound();
            }

            var subgroupModel = new SubgroupModel
            {
                Id = subgroup.Id,
                SubgroupIndex = subgroup.SubgroupIndex
            };

            return Ok(subgroupModel);
        }

        // POST: api/Subgroup
        [HttpPost]
        public async Task<ActionResult<SubgroupModel>> CreateSubgroup(SubgroupModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var subgroup = new Subgroup
            {
                GroupId = 0,//model.GroupId,
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
            if (id != model.Id)
            {
                return BadRequest("ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var subgroup = await _context.Subgroup.FindAsync(id);
            if (subgroup == null)
            {
                return NotFound();
            }

            //subgroup.GroupId = model.GroupId;
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
            if (subgroup == null)
            {
                return NotFound();
            }

            _context.Subgroup.Remove(subgroup);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
