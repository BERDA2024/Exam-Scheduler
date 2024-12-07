using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FacultyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FacultyController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Faculty
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FacultyModel>>> GetFaculties()
        {
            var faculties = await _context.Faculty
                .Select(f => new FacultyModel
                {
                    Id = f.Id,
                    ShortName = f.ShortName,
                    LongName = f.LongName
                })
                .ToListAsync();

            return Ok(faculties);
        }

        // GET: api/Faculty/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<FacultyModel>> GetFaculty(int id)
        {
            var faculty = await _context.Faculty.FindAsync(id);

            if (faculty == null)
            {
                return NotFound();
            }

            var facultyModel = new FacultyModel
            {
                Id = faculty.Id,
                ShortName = faculty.ShortName,
                LongName = faculty.LongName
            };

            return Ok(facultyModel);
        }

        // POST: api/Faculty
        [HttpPost]
        public async Task<ActionResult<FacultyModel>> CreateFaculty(FacultyModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var faculty = new Faculty
            {
                ShortName = model.ShortName,
                LongName = model.LongName
            };

            _context.Faculty.Add(faculty);
            await _context.SaveChangesAsync();

            model.Id = faculty.Id;

            return CreatedAtAction(nameof(GetFaculty), new { id = faculty.Id }, model);
        }

        // PUT: api/Faculty/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFaculty(int id, FacultyModel model)
        {
            if (id != model.Id)
            {
                return BadRequest("ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var faculty = await _context.Faculty.FindAsync(id);
            if (faculty == null)
            {
                return NotFound();
            }

            faculty.ShortName = model.ShortName;
            faculty.LongName = model.LongName;

            _context.Faculty.Update(faculty);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Faculty/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFaculty(int id)
        {
            var faculty = await _context.Faculty.FindAsync(id);
            if (faculty == null)
            {
                return NotFound();
            }

            _context.Faculty.Remove(faculty);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
