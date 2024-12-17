using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Student
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentModel>>> GetStudents()
        {
            var students = await _context.Student
                .Select(s => new StudentModel
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    SubgroupID = s.SubgroupID
                })
                .ToListAsync();

            return Ok(students);
        }

        // GET: api/Student/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentModel>> GetStudent(int id)
        {
            var student = await _context.Student.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            var studentModel = new StudentModel
            {
                Id = student.Id,
                UserId = student.UserId,
                SubgroupID = student.SubgroupID
            };

            return Ok(studentModel);
        }

        // POST: api/Student
        [HttpPost]
        public async Task<ActionResult<StudentModel>> CreateStudent(StudentModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var student = new Student
            {
                UserId = model.UserId,
                SubgroupID = model.SubgroupID
            };

            _context.Student.Add(student);
            await _context.SaveChangesAsync();

            model.Id = student.Id;

            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, model);
        }

        // PUT: api/Student/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, StudentModel model)
        {
            if (id != model.Id)
            {
                return BadRequest("ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var student = await _context.Student.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            student.UserId = model.UserId;
            student.SubgroupID = model.SubgroupID;

            _context.Student.Update(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Student/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Student.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            _context.Student.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
