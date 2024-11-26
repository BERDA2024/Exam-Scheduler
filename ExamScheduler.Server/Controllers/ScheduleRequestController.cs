using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduleRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ScheduleRequestController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllScheduleRequests()
        {
            var requests = await _context.ScheduleRequest
                .ToListAsync();

            return Ok(requests);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetScheduleRequestById(int id)
        {
            var request = await _context.ScheduleRequest
                .FirstOrDefaultAsync(r => r.Id == id);

            if (request == null)
            {
                return NotFound(new { message = "Schedule request not found" });
            }

            return Ok(request);
        }

        [HttpPost]
        public async Task<IActionResult> CreateScheduleRequest([FromBody] ScheduleRequestModel request)
        {
            try
            {
                ScheduleRequest schedule = new () { SubjectID = 0, ClassroomID = 0 , RequestStateID = 0, StudentID = 0, StartDate = DateTime.Now};
                _context.ScheduleRequest.Add(schedule);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetScheduleRequestById), new { id = schedule.Id }, request);
            } catch(Exception error)
            {
                return BadRequest(new { message = error });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateScheduleRequest(int id, [FromBody] ScheduleRequest request)
        {
            if (id != request.Id)
            {
                return BadRequest(new { message = "ID mismatch" });
            }

            _context.Entry(request).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScheduleRequestExists(id))
                {
                    return NotFound(new { message = "Schedule request not found" });
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScheduleRequest(int id)
        {
            var request = await _context.ScheduleRequest.FindAsync(id);
            if (request == null)
            {
                return NotFound(new { message = "Schedule request not found" });
            }

            _context.ScheduleRequest.Remove(request);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool ScheduleRequestExists(int id)
        {
            return _context.ScheduleRequest.Any(e => e.Id == id);
        }
    }
}
