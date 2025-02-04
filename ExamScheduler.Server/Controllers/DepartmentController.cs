﻿using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Domain.Enums;
using ExamScheduler.Server.Source.Models;
using ExamScheduler.Server.Source.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Security.Claims;

namespace ExamScheduler.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController(ApplicationDbContext context, RolesService roleService, UserManager<User> userManager) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly ApplicationDbContext _context = context;
        private readonly RolesService _rolesService = roleService;

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllDepartments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return BadRequest(new { message = "User not found." });

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) return BadRequest(new { message = "User not found." });

            var userRole = await _userManager.GetRolesAsync(user);

            if (userRole == null || userRole.Count == 0) return BadRequest(new { message = "Not authorized" });

            var departments = await _context.Department
                .ToListAsync();

            if (!userRole.Contains(RoleType.Admin.ToString()))
            {
                var facultyId = await _rolesService.GetFacultyIdByRole(user);
                departments = departments
                    .Where(f => f.FacultyId == facultyId).ToList();
            }

            var departmentsModel = departments.Select(department =>
            {
                var faculty = _context.Faculty.FirstOrDefaultAsync(f => f.Id == department.FacultyId).Result;
                return new DepartmentModel()
                {
                    Id = department.Id,
                    LongName = department.LongName,
                    ShortName = department.ShortName,
                    FacultyName = faculty?.ShortName
                };
            }).ToList();

            return Ok(departmentsModel);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,FacultyAdmin")]
        public async Task<IActionResult> GetDepartmentById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return BadRequest(new { message = "User not found." });

            var user = await _userManager.FindByNameAsync(userId);

            if (user == null) return BadRequest(new { message = "User not found." });

            var facultyId = await _rolesService.GetFacultyIdByRole(user);
            var dep = await _context.Department
                .FirstOrDefaultAsync(a => a.Id == id && a.FacultyId == facultyId);

            if (dep == null)
            {
                return NotFound(new { message = "Department not found" });
            }

            return Ok(dep);
        }

        [Authorize(Roles = "Admin,FacultyAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreateDepartment([FromBody] DepartmentModel request)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if (userId == null || request == null) return Unauthorized(new { message = "Not connected or bad request." });

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null) return Unauthorized(new { message = "Not connected or bad request." });

                var facultyId = await _rolesService.GetFacultyIdByRole(user);

                if (facultyId == null) return BadRequest(new { message = "Can't create department." });

                var department = new Department()
                {
                    LongName = request.LongName,
                    ShortName = request.ShortName,
                    FacultyId = facultyId
                };

                _context.Department.Add(department);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDepartmentById), new { id = request.Id }, request);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "SomeError: " + ex.Message });
            }
        }

        [Authorize(Roles = "Admin,FacultyAdmin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] DepartmentModel request)
        {
            if (id != request.Id) return BadRequest(new { message = "ID mismatch" });

            var department = await _context.Department.FirstOrDefaultAsync(x => x.Id == id);

            if (department == null) return NotFound(new { message = "Department not found." });

            department.ShortName = request.ShortName;
            department.LongName = request.LongName;

            _context.Entry(department).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepartmentExists(id))
                {
                    return NotFound(new { message = "Faculty not found" });
                }
                throw;
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin,FacultyAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var depa = await _context.Department.FindAsync(id);

            if (depa == null) return NotFound(new { message = "Department not found" });

            _context.Department.Remove(depa);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool DepartmentExists(int id)
        {
            return _context.Department.Any(a => a.Id == id);
        }
    }
}