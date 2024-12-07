using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestStateController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RequestStateController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/RequestState
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RequestStateModel>>> GetRequestStates()
        {
            var requestStates = await _context.RequestState
                .Select(rs => new RequestStateModel
                {
                    Id = rs.Id,
                    State = rs.State
                })
                .ToListAsync();

            return Ok(requestStates);
        }

        // GET: api/RequestState/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<RequestStateModel>> GetRequestState(int id)
        {
            var requestState = await _context.RequestState.FindAsync(id);

            if (requestState == null)
            {
                return NotFound();
            }

            var requestStateModel = new RequestStateModel
            {
                Id = requestState.Id,
                State = requestState.State
            };

            return Ok(requestStateModel);
        }

        // POST: api/RequestState
        [HttpPost]
        public async Task<ActionResult<RequestStateModel>> CreateRequestState(RequestStateModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var requestState = new RequestState
            {
                State = model.State
            };

            _context.RequestState.Add(requestState);
            await _context.SaveChangesAsync();

            model.Id = requestState.Id;

            return CreatedAtAction(nameof(GetRequestState), new { id = requestState.Id }, model);
        }

        // PUT: api/RequestState/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRequestState(int id, RequestStateModel model)
        {
            if (id != model.Id)
            {
                return BadRequest("ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var requestState = await _context.RequestState.FindAsync(id);
            if (requestState == null)
            {
                return NotFound();
            }

            requestState.State = model.State;

            _context.RequestState.Update(requestState);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/RequestState/{id}
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
    }
}
