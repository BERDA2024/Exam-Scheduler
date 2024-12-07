using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.Controllers
{
    [ApiController]
    [Route("api/ScheduleRequest")]
    public class ScheduleRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ScheduleRequestController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ScheduleRequest
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScheduleRequestModel>>> GetScheduleRequests()
        {
            var scheduleRequests = await _context.ScheduleRequest
                .Select(sr => new ScheduleRequestModel
                {
                    Id = sr.Id,
                    SubjectID = sr.SubjectID,
                    StudentID = sr.StudentID,
                    RequestStateID = sr.RequestStateID,
                    ClassroomID = sr.ClassroomID,
                    StartDate = sr.StartDate
                })
                .ToListAsync();

            return Ok(scheduleRequests);
        }

        // GET: api/ScheduleRequest/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ScheduleRequestModel>> GetScheduleRequest(int id)
        {
            var scheduleRequest = await _context.ScheduleRequest.FindAsync(id);

            if (scheduleRequest == null)
            {
                return NotFound();
            }

            var scheduleRequestModel = new ScheduleRequestModel
            {
                Id = scheduleRequest.Id,
                SubjectID = scheduleRequest.SubjectID,
                StudentID = scheduleRequest.StudentID,
                RequestStateID = scheduleRequest.RequestStateID,
                ClassroomID = scheduleRequest.ClassroomID,
                StartDate = scheduleRequest.StartDate
            };

            return Ok(scheduleRequestModel);
        }

        // POST: api/ScheduleRequest
        [HttpPost]
        [Authorize(Roles = "Admin,StudentGroupLeader")]
        public async Task<ActionResult<ScheduleRequestModel>> CreateScheduleRequest(ScheduleRequestModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var scheduleRequest = new ScheduleRequest
            {
                SubjectID = model.SubjectID,
                StudentID = model.StudentID,
                RequestStateID = model.RequestStateID,
                ClassroomID = model.ClassroomID,
                StartDate = model.StartDate
            };

            _context.ScheduleRequest.Add(scheduleRequest);
            await _context.SaveChangesAsync();

            model.Id = scheduleRequest.Id;

            return CreatedAtAction(nameof(GetScheduleRequest), new { id = scheduleRequest.Id }, model);
        }

        // PUT: api/ScheduleRequest/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateScheduleRequest(int id, ScheduleRequestModel model)
        {
            if (id != model.Id)
            {
                return BadRequest("ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var scheduleRequest = await _context.ScheduleRequest.FindAsync(id);
            if (scheduleRequest == null)
            {
                return NotFound();
            }

            scheduleRequest.SubjectID = model.SubjectID;
            scheduleRequest.StudentID = model.StudentID;
            scheduleRequest.RequestStateID = model.RequestStateID;
            scheduleRequest.ClassroomID = model.ClassroomID;
            scheduleRequest.StartDate = model.StartDate;

            _context.ScheduleRequest.Update(scheduleRequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/ScheduleRequest/{id}
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
    }
}
