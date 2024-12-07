using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.Controllers
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

        // GET: api/Classroom
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClassroomModel>>> GetClassrooms()
        {
            var classrooms = await _context.Classroom
                .Select(c => new ClassroomModel
                {
                    Id = c.Id,
                    Name = c.Name,
                    ShortName = c.ShortName,
                    BuildingName = c.BuildingName
                })
                .ToListAsync();

            return Ok(classrooms);
        }

        // GET: api/Classroom/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ClassroomModel>> GetClassroom(int id)
        {
            var classroom = await _context.Classroom.FindAsync(id);

            if (classroom == null)
            {
                return NotFound();
            }

            var classroomModel = new ClassroomModel
            {
                Id = classroom.Id,
                Name = classroom.Name,
                ShortName = classroom.ShortName,
                BuildingName = classroom.BuildingName
            };

            return Ok(classroomModel);
        }

        // POST: api/Classroom
        [HttpPost]
        public async Task<ActionResult<ClassroomModel>> CreateClassroom(ClassroomModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var classroom = new Classroom
            {
                Name = model.Name,
                ShortName = model.ShortName,
                BuildingName = model.BuildingName
            };

            _context.Classroom.Add(classroom);
            await _context.SaveChangesAsync();

            model.Id = classroom.Id;

            return CreatedAtAction(nameof(GetClassroom), new { id = classroom.Id }, model);
        }

        // PUT: api/Classroom/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClassroom(int id, ClassroomModel model)
        {
            if (id != model.Id)
            {
                return BadRequest("ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var classroom = await _context.Classroom.FindAsync(id);
            if (classroom == null)
            {
                return NotFound();
            }

            classroom.Name = model.Name;
            classroom.ShortName = model.ShortName;
            classroom.BuildingName = model.BuildingName;

            _context.Classroom.Update(classroom);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Classroom/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClassroom(int id)
        {
            var classroom = await _context.Classroom.FindAsync(id);
            if (classroom == null)
            {
                return NotFound();
            }

            _context.Classroom.Remove(classroom);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
