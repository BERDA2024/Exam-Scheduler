using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ExamScheduler.Server.Source.Controllers
{
    [ApiController]
    [Route("api/ScheduleRequest")]
    public class ScheduleRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ScheduleRequestController> _logger;

        public ScheduleRequestController(ApplicationDbContext context, ILogger<ScheduleRequestController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/ScheduleRequest
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScheduleRequestModel>>> GetScheduleRequests()
        {
            var scheduleRequests = await _context.ScheduleRequest
                .Select(sr => new ScheduleRequestModel
                {
                    Id = sr.Id,
                    SubjectName = sr.Subject != null ? sr.Subject.LongName : "Unknown",
                    StudentID = sr.StudentID,
                    RequestStateID = sr.RequestStateID,
                    ClassroomName = sr.Classroom != null ? sr.Classroom.Name : "Unknown",
                    StartDate = sr.StartDate,
                    ExamDuration = sr.ExamDuration,
                    ExamType = sr.ExamType,
                    RejectionReason = sr.RejectionReason
                })
                .ToListAsync();

            return Ok(scheduleRequests);
        }

        // GET: api/ScheduleRequest/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ScheduleRequestModel>> GetScheduleRequest(int id)
        {
            var scheduleRequest = await _context.ScheduleRequest
                .Include(sr => sr.Subject)
                .Include(sr => sr.Classroom)
                .FirstOrDefaultAsync(sr => sr.Id == id);

            if (scheduleRequest == null)
            {
                return NotFound(new { message = $"Schedule request with ID {id} not found." });
            }

            var scheduleRequestModel = new ScheduleRequestModel
            {
                Id = scheduleRequest.Id,
                SubjectName = scheduleRequest.Subject?.LongName ?? "Unknown",
                StudentID = scheduleRequest.StudentID,
                RequestStateID = scheduleRequest.RequestStateID,
                ClassroomName = scheduleRequest.Classroom?.Name ?? "Unknown",
                StartDate = scheduleRequest.StartDate,
                ExamDuration = scheduleRequest.ExamDuration,
                ExamType = scheduleRequest.ExamType,
                RejectionReason = scheduleRequest.RejectionReason
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
                _logger.LogWarning("Invalid model state for schedule request.");
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Received schedule request: {@Model}", model);

            // Fetch Subject ID
            var subjectId = await _context.Subject
                .Where(s => s.LongName == model.SubjectName)
                .Select(s => s.Id)
                .FirstOrDefaultAsync();

            if (subjectId == 0)
            {
                var errorMessage = $"Subject '{model.SubjectName}' not found.";
                _logger.LogWarning(errorMessage);
                return NotFound(new { message = errorMessage });
            }

            // Fetch Classroom ID
            var classroomId = await _context.Classroom
                .Where(c => c.Name == model.ClassroomName)
                .Select(c => c.Id)
                .FirstOrDefaultAsync();

            if (classroomId == 0)
            {
                var errorMessage = $"Classroom '{model.ClassroomName}' not found.";
                _logger.LogWarning(errorMessage);
                return NotFound(new { message = errorMessage });
            }

            // Verificare dacă există suprapuneri
            var overlappingExam = await _context.ScheduleRequest
                .Where(sr => sr.ClassroomID == classroomId &&
                             sr.StartDate < model.StartDate.AddMinutes(model.ExamDuration) &&
                             model.StartDate < sr.StartDate.AddMinutes(sr.ExamDuration))
                .FirstOrDefaultAsync();

            if (overlappingExam != null)
            {
                var errorMessage = $"Classroom '{model.ClassroomName}' is already booked during this time.";
                _logger.LogWarning(errorMessage);
                return Conflict(new { message = errorMessage });
            }

            // Validate StartDate
            if (model.StartDate < DateTime.Now)
            {
                var errorMessage = "StartDate cannot be in the past.";
                _logger.LogWarning(errorMessage);
                return BadRequest(new { message = errorMessage });
            }

            try
            {
                var scheduleRequest = new ScheduleRequest
                {
                    SubjectID = subjectId,
                    StudentID = model.StudentID,
                    RequestStateID = 1, // Default state
                    ClassroomID = classroomId,
                    StartDate = model.StartDate,
                    ExamDuration = model.ExamDuration,
                    ExamType = model.ExamType,
                    RejectionReason = model.RejectionReason
                };

                _context.ScheduleRequest.Add(scheduleRequest);
                await _context.SaveChangesAsync();

                model.Id = scheduleRequest.Id;

                _logger.LogInformation("Schedule request created successfully with ID {Id}", scheduleRequest.Id);

                return CreatedAtAction(nameof(GetScheduleRequest), new { id = scheduleRequest.Id }, model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating schedule request.");
                return StatusCode(500, new { message = "Internal server error. Please try again later." });
            }
        }

        // PUT: api/ScheduleRequest/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateScheduleRequest(int id, ScheduleRequestModel model)
        {
            if (id != model.Id)
            {
                _logger.LogWarning($"ID mismatch: {id} != {model.Id}");
                return BadRequest(new { message = "ID mismatch." });
            }

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for schedule request update.");
                return BadRequest(ModelState);
            }

            var scheduleRequest = await _context.ScheduleRequest.FindAsync(id);
            if (scheduleRequest == null)
            {
                return NotFound(new { message = $"Schedule request with ID {id} not found." });
            }

            // Actualizează doar câmpurile care au fost modificate
            scheduleRequest.StudentID = model.StudentID;
            scheduleRequest.RequestStateID = model.RequestStateID;

            // Verifică dacă data de început a fost modificată
            if (model.StartDate != DateTime.MinValue && model.StartDate != scheduleRequest.StartDate)
            {
                scheduleRequest.StartDate = model.StartDate;
            }

            scheduleRequest.ExamDuration = model.ExamDuration;
            scheduleRequest.ExamType = model.ExamType;
            scheduleRequest.RejectionReason = model.RejectionReason;

            if (!string.IsNullOrEmpty(model.ClassroomName))
            {
                var classroom = await _context.Classroom
                    .Where(c => c.Name == model.ClassroomName)
                    .FirstOrDefaultAsync();

                if (classroom == null)
                {
                    return NotFound(new { message = $"Classroom '{model.ClassroomName}' not found." });
                }

                scheduleRequest.ClassroomID = classroom.Id;
            }

            try
            {
                _context.ScheduleRequest.Update(scheduleRequest);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating schedule request.");
                return StatusCode(500, new { message = "Internal server error. Please try again later." });
            }
        }

        // DELETE: api/ScheduleRequest/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScheduleRequest(int id)
        {
            var scheduleRequest = await _context.ScheduleRequest.FindAsync(id);
            if (scheduleRequest == null)
            {
                return NotFound(new { message = $"Schedule request with ID {id} not found." });
            }

            try
            {
                _context.ScheduleRequest.Remove(scheduleRequest);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting schedule request.");
                return StatusCode(500, new { message = "Internal server error. Please try again later." });
            }
        }
    }
}
