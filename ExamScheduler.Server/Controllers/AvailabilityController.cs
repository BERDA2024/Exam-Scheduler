using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvailabilityController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AvailabilityController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAvailabilities()
        {
            var availabilities = await _context.Availability
                .Include(a => a.ProfessorID)
                .ToListAsync();

            return Ok(availabilities);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAvailabilityById(int id)
        {
            var availability = await _context.Availability
                .Include(a => a.ProfessorID)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (availability == null)
            {
                return NotFound(new { message = "Availability not found" });
            }

            return Ok(availability);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAvailability([FromBody] Availability availability)
        {
            _context.Availability.Add(availability);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAvailabilityById), new { id = availability.Id }, availability);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAvailability(int id, [FromBody] Availability availability)
        {
            if (id != availability.Id)
            {
                return BadRequest(new { message = "ID mismatch" });
            }

            _context.Entry(availability).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AvailabilityExists(id))
                {
                    return NotFound(new { message = "Availability not found" });
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAvailability(int id)
        {
            var availability = await _context.Availability.FindAsync(id);
            if (availability == null)
            {
                return NotFound(new { message = "Availability not found" });
            }

            _context.Availability.Remove(availability);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool AvailabilityExists(int id)
        {
            return _context.Availability.Any(e => e.Id == id);
        }
    }
}
