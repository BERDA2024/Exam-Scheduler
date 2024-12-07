using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubjectController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SubjectController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Subject
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubjectModel>>> GetSubjects()
        {
            var subjects = await _context.Subject
                .Select(s => new SubjectModel
                {
                    Id = s.Id,
                    LongName = s.LongName,
                    ShortName = s.ShortName,
                    ProfessorID = s.ProfessorID,
                    DepartmentId = s.DepartmentId,
                    ExamDuration = s.ExamDuration,
                    ExamType = s.ExamType
                })
                .ToListAsync();

            return Ok(subjects);
        }

        // GET: api/Subject/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<SubjectModel>> GetSubject(int id)
        {
            var subject = await _context.Subject.FindAsync(id);

            if (subject == null)
            {
                return NotFound();
            }

            var subjectModel = new SubjectModel
            {
                Id = subject.Id,
                LongName = subject.LongName,
                ShortName = subject.ShortName,
                ProfessorID = subject.ProfessorID,
                DepartmentId = subject.DepartmentId,
                ExamDuration = subject.ExamDuration,
                ExamType = subject.ExamType
            };

            return Ok(subjectModel);
        }

        // POST: api/Subject
        [HttpPost]
        public async Task<ActionResult<SubjectModel>> CreateSubject(SubjectModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var subject = new Subject
            {
                LongName = model.LongName,
                ShortName = model.ShortName,
                ProfessorID = model.ProfessorID,
                DepartmentId = model.DepartmentId,
                ExamDuration = model.ExamDuration,
                ExamType = model.ExamType
            };

            _context.Subject.Add(subject);
            await _context.SaveChangesAsync();

            model.Id = subject.Id;

            return CreatedAtAction(nameof(GetSubject), new { id = subject.Id }, model);
        }

        // PUT: api/Subject/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubject(int id, SubjectModel model)
        {
            if (id != model.Id)
            {
                return BadRequest("ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var subject = await _context.Subject.FindAsync(id);
            if (subject == null)
            {
                return NotFound();
            }

            subject.LongName = model.LongName;
            subject.ShortName = model.ShortName;
            subject.ProfessorID = model.ProfessorID;
            subject.DepartmentId = model.DepartmentId;
            subject.ExamDuration = model.ExamDuration;
            subject.ExamType = model.ExamType;

            _context.Subject.Update(subject);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Subject/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            var subject = await _context.Subject.FindAsync(id);
            if (subject == null)
            {
                return NotFound();
            }

            _context.Subject.Remove(subject);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
