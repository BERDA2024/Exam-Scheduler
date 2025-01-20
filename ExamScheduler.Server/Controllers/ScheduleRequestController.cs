using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Domain.Enums;
using ExamScheduler.Server.Source.Models;
using ExamScheduler.Server.Source.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Security.Claims;

namespace ExamScheduler.Server.Source.Controllers
{
    [ApiController]
    [Route("api/ScheduleRequest")]
    public class ScheduleRequestController(ApplicationDbContext context, UserManager<User> userManager, RolesService userRoleService, ILogger<ScheduleRequestController> logger, NotificationService notificationService) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly ApplicationDbContext _context = context;
        private readonly RolesService _userRoleService = userRoleService;
        private readonly ILogger<ScheduleRequestController> _logger = logger;
        private readonly NotificationService _notificationService = notificationService;

        // GET: api/ScheduleRequest
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ScheduleRequestModel>>> GetScheduleRequests()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if (userId == null) return BadRequest(new { message = "User not found" });

                var professor = await _context.Professor.FirstOrDefaultAsync(p => p.UserId == userId);

                bool isProfessor = professor != null;

                var student = await _context.Student.FirstOrDefaultAsync(s => s.UserId == userId);

                bool isStudent = student != null;

                var studentsIds = new List<int>();

                if (isStudent)
                {
                    var subgroup = await _context.Subgroup.FirstOrDefaultAsync(sg => sg.Id == student.SubgroupID);

                    if (subgroup == null) return BadRequest(new { message = "Student not in a group" });

                    var subgroupsIds = await _context.Subgroup
                        .Where(sg => sg.Id == subgroup.GroupId)
                        .Select(sg => sg.Id)
                        .ToListAsync();

                    studentsIds = await _context.Student
                        .Where(s => s.SubgroupID != null && subgroupsIds.Contains((int)s.SubgroupID))
                        .Select(s => s.Id)
                        .ToListAsync();
                }

                if (professor == null && student == null) return BadRequest(new { message = "Role users not found" });

                var scheduleRequests = await _context.ScheduleRequest
                    .Include(sr => sr.Student)
                    .Include(sr => sr.Subject)
                    .Include(sr => sr.Classroom)
                    .Where(sr => isProfessor ? sr.Subject.ProfessorID == professor.Id : (isStudent && studentsIds.Contains(sr.StudentID)))
                    .Select(sr => new ScheduleRequestModel
                    {
                        Id = sr.Id,
                        SubjectName = sr.Subject != null ? sr.Subject.LongName : "Unknown",
                        StudentID = sr.StudentID,
                        SubgroupID = sr.SubgroupID, // Preluăm SubgroupID din ScheduleRequest
                        RequestStateID = sr.RequestStateID,
                        ClassroomName = sr.Classroom != null ? sr.Classroom.Name : "Unknown",
                        StartDate = sr.StartDate,
                        ExamDuration = sr.ExamDuration,
                        ExamType = sr.ExamType,
                        RejectionReason = sr.RejectionReason ?? "Not specified"
                    })
                    .ToListAsync();

                return Ok(scheduleRequests);
            }
            catch (Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
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
                SubgroupID = scheduleRequest.SubgroupID, // Preluăm SubgroupID
                RequestStateID = scheduleRequest.RequestStateID,
                ClassroomName = scheduleRequest.Classroom?.Name ?? "Unknown",
                StartDate = scheduleRequest.StartDate,
                ExamDuration = scheduleRequest.ExamDuration,
                ExamType = scheduleRequest.ExamType,
                RejectionReason = scheduleRequest.RejectionReason ?? "Not specified"
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

            // Obținem SubjectID din baza de date
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

            // Obținem ClassroomID din baza de date
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

            // Obținem SubgroupID din Student
            var subgroupId = await _context.Student
                .Where(s => s.Id == model.StudentID)
                .Select(s => s.SubgroupID)
                .FirstOrDefaultAsync();

            if (subgroupId == null)
            {
                var errorMessage = $"Student with ID {model.StudentID} does not belong to any subgroup.";
                _logger.LogWarning(errorMessage);
                return NotFound(new { message = errorMessage });
            }

            // Verificăm dacă StartDate este în trecut
            if (model.StartDate < DateTime.Now)
            {
                var errorMessage = "StartDate cannot be in the past.";
                _logger.LogWarning(errorMessage);
                return BadRequest(new { message = errorMessage });
            }

            try
            {
                // Creăm obiectul ScheduleRequest
                var scheduleRequest = new ScheduleRequest
                {
                    SubjectID = subjectId,
                    StudentID = model.StudentID,
                    SubgroupID = subgroupId.Value, // Setăm SubgroupID
                    RequestStateID = 1, // Statusul inițial (poate fi configurat diferit)
                    ClassroomID = classroomId,
                    StartDate = model.StartDate,
                    ExamDuration = model.ExamDuration,
                    ExamType = model.ExamType,
                    RejectionReason = model.RejectionReason
                };

                // Adăugăm cererea în baza de date
                _context.ScheduleRequest.Add(scheduleRequest);
                await _context.SaveChangesAsync();

                var subject = await _context.Subject.FindAsync(subjectId);
                var professor = await _context.Professor.FindAsync(subject.ProfessorID);

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if(userId != null)
                    await _notificationService.AddNotificationAsync("New schedule request.", $"You have a new schedule request for the subject \"{model.SubjectName}\"", userId, professor.UserId);

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
        [Authorize]
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

            // Actualizăm ScheduleRequest
            scheduleRequest.StudentID = model.StudentID;
            scheduleRequest.RequestStateID = model.RequestStateID;
            scheduleRequest.StartDate = model.StartDate != DateTime.MinValue ? model.StartDate : scheduleRequest.StartDate;
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

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT
                
                if (userId != null)
                {
                    var user = await _context.Users.FindAsync(userId);
                    var userRole = await _userManager.GetRolesAsync(user);

                    var subject = await _context.Subject
                        .Where(s => s.LongName == model.SubjectName)
                        .FirstOrDefaultAsync();
                    if (userRole.Contains(RoleType.Professor.ToString()))
                    {
                        var student = await _context.Student.FindAsync(model.StudentID);
                        if (student != null)
                            await _notificationService.AddNotificationAsync("Schedule request was modified.", $"Your schedule request for the subject \"{model.SubjectName}\" was modified.", userId, student.UserId);
                    }
                    else
                    {
                        var professor = await _context.Professor.FindAsync(subject.ProfessorID);
                        if (professor != null)
                            await _notificationService.AddNotificationAsync("Schedule request was modified.", $"Your schedule request for the subject \"{model.SubjectName}\" was modified.", userId, professor.UserId);
                    }
                }

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

                var subject = await _context.Subject.FindAsync(scheduleRequest.SubjectID);
                var professor = await _context.Professor.FindAsync(subject.ProfessorID);

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if (userId != null)
                    await _notificationService.AddNotificationAsync("Schedule request was modified.", $"Your schedule request for the subject \"{subject.LongName}\" was modified.", userId, professor.UserId);

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
