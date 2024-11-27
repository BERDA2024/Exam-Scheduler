using ExamScheduler.Server.Source.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ExamScheduler.Server.Source.Services;
using ExamScheduler.Server.Source.Models;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvailabilityController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public AvailabilityController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        // GET: api/Availability/get
        [Authorize]
        [HttpGet("get")]
        public async Task<IActionResult> GetAvailability()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return Unauthorized();
            }

            return Ok(new { FullName = user.FirstName + " " + user.LastName, user.Email });
        }

        // POST: api/Availability/add
        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddAvailability([FromBody] AvailabilityModel model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            //if (result.Succeeded)
                return Ok(new { message = "User registered successfully!" });

            //return BadRequest(result.Errors);
        }
    }
}
