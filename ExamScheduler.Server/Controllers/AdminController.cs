using ExamScheduler.Server.Source.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ExamScheduler.Server.Source.Services;
using Microsoft.EntityFrameworkCore;
using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Models;

namespace ExamScheduler.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController(JwtTokenService jwtTokenService, UserManager<User> userManager, SignInManager<User> signInManager, ApplicationDbContext context) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly SignInManager<User> _signInManager = signInManager;
        private readonly JwtTokenService _jwtTokenService = jwtTokenService;
        private readonly ApplicationDbContext _context = context;

        [HttpGet("user")]
        [Authorize] // Ensures that only authenticated users can access this endpoint
        public async Task<IActionResult> GetUsers()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

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

        // POST: api/User/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = new User() { FirstName = model.FirstName, LastName = model.LastName, UserName = model.Email, Email = model.Email};
            var result = await _userManager.CreateAsync(user, model.Password);  // Hashes password automatically
            
            if (result.Succeeded)
            {
                try
                {
                    var newUser = await _userManager.FindByEmailAsync(model.Email);

                    if (newUser != null && !string.IsNullOrEmpty(model.Role))
                        await _userManager.AddToRoleAsync(newUser, model.Role);

                    return Ok(new { message = "User registered successfully!" });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = ex });
                }
            }

            return BadRequest(result.Errors);
        }

        // POST: api/User/logout
        [HttpPost("logout")]
        [Authorize]  // Ensure that the user is authenticated
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();  // Sign out the user

            return Ok(new { message = "User logged out successfully!" });
        }
    }
}
