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
    public class RequestStatesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RequestStatesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/RequestStates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RequestState>>> GetRequestState()
        {
            return await _context.RequestState.ToListAsync();
        }

        // GET: api/RequestStates/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RequestState>> GetRequestState(int id)
        {
            var requestState = await _context.RequestState.FindAsync(id);

            if (requestState == null)
            {
                return NotFound();
            }

            return requestState;
        }

        // PUT: api/RequestStates/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRequestState(int id, RequestState requestState)
        {
            if (id != requestState.RequestStateID)
            {
                return BadRequest();
            }

            _context.Entry(requestState).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RequestStateExists(id))
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

        // POST: api/RequestStates
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RequestState>> PostRequestState(RequestState requestState)
        {
            _context.RequestState.Add(requestState);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRequestState", new { id = requestState.RequestStateID }, requestState);
        }

        // DELETE: api/RequestStates/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRequestState(int id)
        {
            var requestState = await _context.RequestState.FindAsync(id);
            if (requestState == null)
            {
                return NotFound();
            }

            _context.RequestState.Remove(requestState);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RequestStateExists(int id)
        {
            return _context.RequestState.Any(e => e.RequestStateID == id);
        }
    }
}
