using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassroomController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClassroomController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllClassrooms()
        {
            var classrooms = await _context.Classroom.ToListAsync();
            return Ok(classrooms);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetClassroomById(int id)
        {
            var classroom = await _context.Classroom.FindAsync(id);
            if (classroom == null)
            {
                return NotFound(new { message = "Classroom not found" });
            }
            return Ok(classroom);
        }

        [HttpPost]
        public async Task<IActionResult> CreateClassroom([FromBody] Classroom classroom)
        {
            _context.Classroom.Add(classroom);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetClassroomById), new { id = classroom.Id }, classroom);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClassroom(int id, [FromBody] Classroom classroom)
        {
            if (id != classroom.Id)
            {
                return BadRequest(new { message = "ID mismatch" });
            }

            _context.Entry(classroom).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClassroomExists(id))
                {
                    return NotFound(new { message = "Classroom not found" });
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClassroom(int id)
        {
            var classroom = await _context.Classroom.FindAsync(id);
            if (classroom == null)
            {
                return NotFound(new { message = "Classroom not found" });
            }

            _context.Classroom.Remove(classroom);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool ClassroomExists(int id)
        {
            return _context.Classroom.Any(e => e.Id == id);
        }
    }
}
