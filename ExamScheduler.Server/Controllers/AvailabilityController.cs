using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ExamScheduler.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvailabilityController(ApplicationDbContext context, UserManager<User> userManager) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly ApplicationDbContext _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAllAvailabilities()
        {
            var availabilities = await _context.Availability
                .ToListAsync();

            return Ok(availabilities);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAvailabilityById(int id)
        {
            var availability = await _context.Availability
                .FirstOrDefaultAsync(a => a.Id == id);

            if (availability == null)
            {
                return NotFound(new { message = "Availability not found" });
            }

            return Ok(availability);
        }

        [Authorize(Roles = "Admin,Professor")]
        [HttpPost]
        public async Task<IActionResult> CreateAvailability([FromBody] AvailabilityModel request)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if (userId == null || request == null)
                {
                    return Unauthorized(new { message = "Not connected or bad request." });
                }

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return Unauthorized(new { message = "User is not found" });
                }

                //var professor = await _context.Professor.FirstOrDefaultAsync(a => a.UserId == userId);

                //if (professor == null) return Unauthorized(new { message = "Professor not found." });

                var availability = new Availability() { ProfessorID = 0, StartDate = request.StartDate, EndDate = request.EndDate };
                _context.Availability.Add(availability);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetAvailabilityById), new { id = availability.Id }, availability);
            }
            catch (Exception ex)
            {
                return BadRequest("SomeError: " + ex.Message);
            }
        }

        [Authorize(Roles = "Admin,Professor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAvailability(int id, [FromBody] AvailabilityModel availability)
        {
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

        [Authorize(Roles = "Admin,Professor")]
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