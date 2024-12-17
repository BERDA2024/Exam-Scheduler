using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SecretaryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SecretaryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Secretary
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SecretaryModel>>> GetSecretaries()
        {
            var secretaries = await _context.Secretary
                .Select(s => new SecretaryModel
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    FacultyId = s.FacultyId
                })
                .ToListAsync();

            return Ok(secretaries);
        }

        // GET: api/Secretary/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<SecretaryModel>> GetSecretary(int id)
        {
            var secretary = await _context.Secretary.FindAsync(id);

            if (secretary == null)
            {
                return NotFound();
            }

            var secretaryModel = new SecretaryModel
            {
                Id = secretary.Id,
                UserId = secretary.UserId,
                FacultyId = secretary.FacultyId
            };

            return Ok(secretaryModel);
        }

        // POST: api/Secretary
        [HttpPost]
        public async Task<ActionResult<SecretaryModel>> CreateSecretary(SecretaryModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var secretary = new Secretary
            {
                UserId = model.UserId,
                FacultyId = model.FacultyId
            };

            _context.Secretary.Add(secretary);
            await _context.SaveChangesAsync();

            model.Id = secretary.Id;

            return CreatedAtAction(nameof(GetSecretary), new { id = secretary.Id }, model);
        }

        // PUT: api/Secretary/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSecretary(int id, SecretaryModel model)
        {
            if (id != model.Id)
            {
                return BadRequest("ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var secretary = await _context.Secretary.FindAsync(id);
            if (secretary == null)
            {
                return NotFound();
            }

            secretary.UserId = model.UserId;
            secretary.FacultyId = model.FacultyId;

            _context.Secretary.Update(secretary);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Secretary/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSecretary(int id)
        {
            var secretary = await _context.Secretary.FindAsync(id);
            if (secretary == null)
            {
                return NotFound();
            }

            _context.Secretary.Remove(secretary);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
