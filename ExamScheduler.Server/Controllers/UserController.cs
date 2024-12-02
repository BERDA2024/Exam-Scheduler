using ExamScheduler.Server.Source.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ExamScheduler.Server.Source.Services;
using ExamScheduler.Server.Source.Models;
using ExamScheduler.Server.Source.Domain.Enums;

namespace ExamScheduler.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(JwtTokenService jwtTokenService, UserManager<User> userManager, SignInManager<User> signInManager, EmailService emailService) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly SignInManager<User> _signInManager = signInManager;
        private readonly JwtTokenService _jwtTokenService = jwtTokenService;
        private readonly EmailService _emailService = emailService;

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
            var user = new User() { FirstName = model.FirstName, LastName = model.LastName, UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);  // Hashes password automatically

            if (result.Succeeded)
            {
                try
                {
                    //var subject = "Welcome to Our App!";
                    //var body = $"<p>Hi {user.UserName},</p><p>Thank you for signing up!</p>";
                    //await _emailService.SendEmailAsync(user.Email, subject, body);
                    var addedUser = await _userManager.FindByEmailAsync(user.Email);

                    if (addedUser != null)
                        await userManager.AddToRoleAsync(addedUser, RoleType.Student.ToString());
                    return Ok(new { message = "User registered successfully!" });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = ex });
                }
            }

            return BadRequest(new { message = result.Errors });
        }

        // Method to change the user's password
        [Authorize]
        [HttpPost]
        [Route("change-password")]
        public async Task<IActionResult> ChangePasswordAsync([FromBody] ChangePasswordModel model)
        {
            // Get the currently logged-in user
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return BadRequest(new { message = "User not found." });
            }

            // Change the user's password
            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

            if (result.Succeeded)
            {
                return Ok(new { message = "Password changed successfully." });
            }
            else
            {
                // Return the error messages if password change fails
                return BadRequest(new { message = "Invalid passwords." });
            }
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
