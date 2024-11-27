using ExamScheduler.Server.Source.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ExamScheduler.Server.Source.Services;

namespace ExamScheduler.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(JwtTokenService jwtTokenService, UserManager<User> userManager, SignInManager<User> signInManager) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly SignInManager<User> _signInManager = signInManager;
        private readonly JwtTokenService _jwtTokenService = jwtTokenService;

        [HttpGet("profile")]
        [Authorize] // Ensures that only authenticated users can access this endpoint
        public async Task<IActionResult> GetUserProfile()
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
            var user = new User() { FirstName = model.FirstName, LastName = model.LastName, UserName = model.Email, Email = model.Email, RoleID = 1 };
            var result = await _userManager.CreateAsync(user, model.Password);  // Hashes password automatically
            try
            {
                var newUser = await _userManager.FindByEmailAsync(model.Email);

                if(newUser != null)
                    await _userManager.AddToRoleAsync(newUser, "Admin");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex });
            }
            if (result.Succeeded)
            {
                return Ok(new { message = "User registered successfully!" });
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized(new { message = "Invalid login attempt." });
            }

            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

            if (result.Succeeded)
            {
                var token = _jwtTokenService.GenerateToken(user);

                return Ok(new { token });
            }

            return Unauthorized(new { message = "Invalid login attempt." });
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
