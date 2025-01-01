using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DepartmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Department
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartmentModel>>> GetDepartments()
        {
            var departments = await _context.Department
                .Select(d => new DepartmentModel
                {
                    Id = d.Id,
                    LongName = d.LongName,
                    ShortName = d.ShortName,
                    FacultyId = d.FacultyId
                })
                .ToListAsync();

            return Ok(departments);
        }

        // GET: api/Department/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentModel>> GetDepartment(int id)
        {
            var department = await _context.Department.FindAsync(id);

            if (department == null)
            {
                return NotFound();
            }

            var departmentModel = new DepartmentModel
            {
                Id = department.Id,
                LongName = department.LongName,
                ShortName = department.ShortName,
                FacultyId = department.FacultyId
            };

            return Ok(departmentModel);
        }

        // POST: api/Department
        [HttpPost]
        public async Task<ActionResult<DepartmentModel>> CreateDepartment(DepartmentModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var department = new Department
            {
                LongName = model.LongName,
                ShortName = model.ShortName,
                FacultyId = model.FacultyId
            };

            _context.Department.Add(department);
            await _context.SaveChangesAsync();

            model.Id = department.Id;

            return CreatedAtAction(nameof(GetDepartment), new { id = department.Id }, model);
        }

        // PUT: api/Department/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, DepartmentModel model)
        {
            if (id != model.Id)
            {
                return BadRequest("ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var department = await _context.Department.FindAsync(id);
            if (department == null)
            {
                return NotFound();
            }

            department.LongName = model.LongName;
            department.ShortName = model.ShortName;
            department.FacultyId = model.FacultyId;

            _context.Department.Update(department);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Department/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var department = await _context.Department.FindAsync(id);
            if (department == null)
            {
                return NotFound();
            }

            _context.Department.Remove(department);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
