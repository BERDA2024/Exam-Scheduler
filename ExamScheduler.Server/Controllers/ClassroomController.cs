﻿using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
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
    public class ClassroomController(ApplicationDbContext context, RolesService roleService, UserManager<User> userManager) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly ApplicationDbContext _context = context;
        private readonly RolesService _rolesService = roleService;

        [HttpGet]
        [Authorize(Roles = "Admin,FacultyAdmin,StudentGroupLeader")]
        public async Task<IActionResult> GetAllClassrooms()
        {
            var classrooms = await _context.Classroom.ToListAsync();
            Console.WriteLine($"Classrooms fetched: {classrooms.Count}");
            return Ok(classrooms);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,FacultyAdmin")]
        public async Task<IActionResult> GetClassroomById(int id)
        {
            var classroom = await _context.Classroom.FindAsync(id);
            if (classroom == null)
            {
                return NotFound(new { message = "Classroom not found." });
            }
            return Ok(classroom);
        }

        [Authorize(Roles = "Admin,FacultyAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreateClassroom([FromBody] Classroom request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Invalid request." });
            }

            var classroom = new Classroom
            {
                Name = request.Name,
                ShortName = request.ShortName,
                BuildingName = request.BuildingName
            };

            _context.Classroom.Add(classroom);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetClassroomById), new { id = classroom.Id }, classroom);
        }

        [Authorize(Roles = "Admin,FacultyAdmin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClassroom(int id, [FromBody] Classroom request)
        {
            if (id != request.Id)
            {
                return BadRequest(new { message = "ID mismatch." });
            }

            var classroom = await _context.Classroom.FindAsync(id);
            if (classroom == null)
            {
                return NotFound(new { message = "Classroom not found." });
            }

            classroom.Name = request.Name;
            classroom.ShortName = request.ShortName;
            classroom.BuildingName = request.BuildingName;

            _context.Entry(classroom).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClassroomExists(id))
                {
                    return NotFound(new { message = "Classroom not found." });
                }
                throw;
            }

            return Ok(new {message = "Classromm update succesfuly"});
        }

        [HttpGet("check-availability")]
        [Authorize(Roles = "Admin,FacultyAdmin,StudentGroupLeader")]
        public async Task<IActionResult> CheckClassroomAvailability(int classroomId, DateTime examStartDate, int examDuration)
        {
            // Calculăm intervalul de timp pentru examen
            var examEndDate = examStartDate.AddMinutes(examDuration);

            // Verificăm dacă există un alt examen în aceeași sală și în același interval
            var isClassroomOccupied = await _context.ScheduleRequest
                .AnyAsync(req =>
                    req.ClassroomID == classroomId &&
                    req.RequestStateID == 2 && // Doar cererile aprobate
                    (examStartDate < req.StartDate.AddMinutes(req.ExamDuration) && // Începutul examenului nostru este înainte de finalul unui examen existent
                     examEndDate > req.StartDate) // Sfârșitul examenului nostru este după începutul unui examen existent
                );

            if (isClassroomOccupied)
            {
                return Conflict(new { message = "The classroom is already booked for the selected time." });
            }

            return Ok(new { message = "The classroom is available." });
        }

        [Authorize(Roles = "Admin,FacultyAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClassroom(int id)
        {
            var classroom = await _context.Classroom.FindAsync(id);
            if (classroom == null)
            {
                return NotFound(new { message = "Classroom not found." });
            }

            _context.Classroom.Remove(classroom);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClassroomExists(int id)
        {
            return _context.Classroom.Any(c => c.Id == id);
        }
    }
}