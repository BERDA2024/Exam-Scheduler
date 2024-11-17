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
    public class ScheduleRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ScheduleRequestsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ScheduleRequests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScheduleRequest>>> GetScheduleRequest()
        {
            return await _context.ScheduleRequest.ToListAsync();
        }

        // GET: api/ScheduleRequests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ScheduleRequest>> GetScheduleRequest(int id)
        {
            var scheduleRequest = await _context.ScheduleRequest.FindAsync(id);

            if (scheduleRequest == null)
            {
                return NotFound();
            }

            return scheduleRequest;
        }

        // PUT: api/ScheduleRequests/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutScheduleRequest(int id, ScheduleRequest scheduleRequest)
        {
            if (id != scheduleRequest.RequestID)
            {
                return BadRequest();
            }

            _context.Entry(scheduleRequest).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScheduleRequestExists(id))
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

        // POST: api/ScheduleRequests
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ScheduleRequest>> PostScheduleRequest(ScheduleRequest scheduleRequest)
        {
            _context.ScheduleRequest.Add(scheduleRequest);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetScheduleRequest", new { id = scheduleRequest.RequestID }, scheduleRequest);
        }

        // DELETE: api/ScheduleRequests/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScheduleRequest(int id)
        {
            var scheduleRequest = await _context.ScheduleRequest.FindAsync(id);
            if (scheduleRequest == null)
            {
                return NotFound();
            }

            _context.ScheduleRequest.Remove(scheduleRequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ScheduleRequestExists(int id)
        {
            return _context.ScheduleRequest.Any(e => e.RequestID == id);
        }
    }
}
