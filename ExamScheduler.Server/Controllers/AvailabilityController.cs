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



        [HttpGet("availability-by-professor")]
        [Authorize]
        public async Task<IActionResult> GetAvailabilityByProfessor()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return BadRequest(new { message = "User not found." });

            try
            {
                // Găsește profesorul asociat utilizatorului curent
                var professor = await _context.Professor
                    .FirstOrDefaultAsync(p => p.UserId == userId);

                if (professor == null) return NotFound(new { message = "Professor not found." });

                // Găsește disponibilitățile asociate profesorului
                var availabilities = await _context.Availability
                    .Where(a => a.ProfessorID == professor.Id)
                    .ToListAsync();

                var availabilitiesModels = new List<AvailabilityModel>();

                foreach (var availability in availabilities)
                {
                    availabilitiesModels.Add(new AvailabilityModel
                    {
                        Id = availability.Id,
                        StartDate = availability.StartDate,
                        EndDate = availability.EndDate
                    });
                }

                return Ok(availabilitiesModels);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error: " + ex.Message });
            }
        }

        [HttpGet("availability-by-subject")]
        [Authorize]
        public async Task<IActionResult> GetAvailabilityBySubject(string subjectName)
        {

            try
            {
                // Găsește subiectul și profesorul asociat
                var subject = await _context.Subject
                    .FirstOrDefaultAsync(s => s.LongName == subjectName);

                if (subject == null)
                {
                    return NotFound(new { message = "Subject not found." });
                }

                // Găsește disponibilitățile profesorului asociat subiectului
                var availability = await _context.Availability
                    .Where(a => a.ProfessorID == subject.ProfessorID)
                    .ToListAsync();

                if (availability.Count == 0)
                {
                    return NotFound(new { message = "No availability found for the professor." });
                }

                return Ok(availability);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error: " + ex.Message });
            }
        }


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

        [HttpPost]
        [Authorize(Roles = "Admin,Professor")]
        public async Task<IActionResult> CreateAvailability([FromBody] AvailabilityModel request)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (userId == null) return BadRequest(new { message = "User not found" });

                var professor = await _context.Professor.FirstOrDefaultAsync(p => p.UserId == userId);

                if (professor == null) return Unauthorized(new { message = "Professor not found." });

                var availability = new Availability
                {
                    ProfessorID = professor.Id,
                    StartDate = request.StartDate,
                    EndDate = request.EndDate
                };

                _context.Availability.Add(availability);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAvailabilityById), new { id = availability.Id }, availability);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error: " + ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Professor")]
        public async Task<IActionResult> UpdateAvailability(int id, [FromBody] AvailabilityModel model)
        {
            if (!ModelState.IsValid) return BadRequest(new { message = ModelState });

            var availability = await _context.Availability.FindAsync(id);

            if (availability == null) return NotFound(new { message = "Availability not found" });

            availability.StartDate = model.StartDate;
            availability.EndDate = model.EndDate;

            _context.Availability.Update(availability);
            await _context.SaveChangesAsync();

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