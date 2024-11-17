using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Models;

namespace ExamScheduler.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstitutesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InstitutesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Institutes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Institute>>> GetInstitute()
        {
            return await _context.Institute.ToListAsync();
        }

        // GET: api/Institutes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Institute>> GetInstitute(int id)
        {
            var institute = await _context.Institute.FindAsync(id);

            if (institute == null)
            {
                return NotFound();
            }

            return institute;
        }

        // PUT: api/Institutes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInstitute(int id, Institute institute)
        {
            if (id != institute.InstituteID)
            {
                return BadRequest();
            }

            _context.Entry(institute).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InstituteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Institutes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Institute>> PostInstitute(Institute institute)
        {
            _context.Institute.Add(institute);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInstitute", new { id = institute.InstituteID }, institute);
        }

        // DELETE: api/Institutes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInstitute(int id)
        {
            var institute = await _context.Institute.FindAsync(id);
            if (institute == null)
            {
                return NotFound();
            }

            _context.Institute.Remove(institute);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InstituteExists(int id)
        {
            return _context.Institute.Any(e => e.InstituteID == id);
        }
    }
}
