using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfessorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProfessorController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Professor
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProfessorModel>>> GetProfessors()
        {
            var professors = await _context.Professor
                .Select(p => new ProfessorModel
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    FacultyId = p.FacultyId
                })
                .ToListAsync();

            return Ok(professors);
        }

        // GET: api/Professor/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProfessorModel>> GetProfessor(int id)
        {
            var professor = await _context.Professor.FindAsync(id);

            if (professor == null)
            {
                return NotFound();
            }

            var professorModel = new ProfessorModel
            {
                Id = professor.Id,
                UserId = professor.UserId,
                FacultyId = professor.FacultyId
            };

            return Ok(professorModel);
        }

        // POST: api/Professor
        [HttpPost]
        public async Task<ActionResult<ProfessorModel>> CreateProfessor(ProfessorModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var professor = new Professor
            {
                UserId = model.UserId,
                FacultyId = model.FacultyId
            };

            _context.Professor.Add(professor);
            await _context.SaveChangesAsync();

            model.Id = professor.Id;

            return CreatedAtAction(nameof(GetProfessor), new { id = professor.Id }, model);
        }

        // PUT: api/Professor/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfessor(int id, ProfessorModel model)
        {
            if (id != model.Id)
            {
                return BadRequest("ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var professor = await _context.Professor.FindAsync(id);
            if (professor == null)
            {
                return NotFound();
            }

            professor.UserId = model.UserId;
            professor.FacultyId = model.FacultyId;

            _context.Professor.Update(professor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Professor/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProfessor(int id)
        {
            var professor = await _context.Professor.FindAsync(id);
            if (professor == null)
            {
                return NotFound();
            }

            _context.Professor.Remove(professor);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
