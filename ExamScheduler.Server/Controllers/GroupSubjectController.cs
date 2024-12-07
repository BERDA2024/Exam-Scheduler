using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupSubjectController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GroupSubjectController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/GroupSubject
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroupSubjectModel>>> GetGroupSubjects()
        {
            var groupSubjects = await _context.GroupSubject
                .Select(gs => new GroupSubjectModel
                {
                    Id = gs.Id,
                    SubjectID = gs.SubjectID,
                    GroupID = gs.GroupID
                })
                .ToListAsync();

            return Ok(groupSubjects);
        }

        // GET: api/GroupSubject/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<GroupSubjectModel>> GetGroupSubject(int id)
        {
            var groupSubject = await _context.GroupSubject.FindAsync(id);

            if (groupSubject == null)
            {
                return NotFound();
            }

            var groupSubjectModel = new GroupSubjectModel
            {
                Id = groupSubject.Id,
                SubjectID = groupSubject.SubjectID,
                GroupID = groupSubject.GroupID
            };

            return Ok(groupSubjectModel);
        }

        // POST: api/GroupSubject
        [HttpPost]
        public async Task<ActionResult<GroupSubjectModel>> CreateGroupSubject(GroupSubjectModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var groupSubject = new GroupSubject
            {
                SubjectID = model.SubjectID,
                GroupID = model.GroupID
            };

            _context.GroupSubject.Add(groupSubject);
            await _context.SaveChangesAsync();

            model.Id = groupSubject.Id;

            return CreatedAtAction(nameof(GetGroupSubject), new { id = groupSubject.Id }, model);
        }

        // PUT: api/GroupSubject/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGroupSubject(int id, GroupSubjectModel model)
        {
            if (id != model.Id)
            {
                return BadRequest("ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var groupSubject = await _context.GroupSubject.FindAsync(id);
            if (groupSubject == null)
            {
                return NotFound();
            }

            groupSubject.SubjectID = model.SubjectID;
            groupSubject.GroupID = model.GroupID;

            _context.GroupSubject.Update(groupSubject);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/GroupSubject/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroupSubject(int id)
        {
            var groupSubject = await _context.GroupSubject.FindAsync(id);
            if (groupSubject == null)
            {
                return NotFound();
            }

            _context.GroupSubject.Remove(groupSubject);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
