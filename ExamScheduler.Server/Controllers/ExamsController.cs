using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ExamsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private static readonly ScheduleRequest[] Schedules =
        [
            new ScheduleRequest(){ },
        ];

        public ExamsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetExams")]
        public async Task<IEnumerable<ScheduleRequest>> GetAsync()
        {
            return await _context.ScheduleRequest.ToArrayAsync();
        }

        [HttpPost]
        public async Task<ActionResult<ScheduleRequest>> ScheduleExam(ScheduleRequest exam)
        {
            // Logic for room and scheduling constraints
            if (CheckRoomAvailability(exam))
            {
                _context.ScheduleRequest.Add(exam);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetExam", new { id = exam.RequestID, }, exam);
            }
            return BadRequest("Room is not available.");
        }

        private bool CheckRoomAvailability(ScheduleRequest exam)
        {
            // Implement your logic here to check room availability
            var existingExams = _context.ScheduleRequest.Where(e => e.ClassroomID == exam.ClassroomID && e.StartDate == exam.StartDate);
            return !existingExams.Any();
        }
    }
}
