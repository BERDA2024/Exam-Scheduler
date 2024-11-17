using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Models;

namespace ExamScheduler.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AvailabilitiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AvailabilitiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Availabilities
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Availability>>> GetAvailability()
        {
            return await _context.Availability.ToListAsync();
        }

        // GET: api/Availabilities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Availability>> GetAvailability(int id)
        {
            var availability = await _context.Availability.FindAsync(id);

            if (availability == null)
            {
                return NotFound();
            }

            return availability;
        }

        // PUT: api/Availabilities/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAvailability(int id, Availability availability)
        {
            if (id != availability.AvailabilityID)
            {
                return BadRequest();
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
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Availabilities
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Availability>> PostAvailability(Availability availability)
        {
            _context.Availability.Add(availability);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAvailability", new { id = availability.AvailabilityID }, availability);
        }

        // DELETE: api/Availabilities/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAvailability(int id)
        {
            var availability = await _context.Availability.FindAsync(id);
            if (availability == null)
            {
                return NotFound();
            }

            _context.Availability.Remove(availability);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AvailabilityExists(int id)
        {
            return _context.Availability.Any(e => e.AvailabilityID == id);
        }
    }
}
