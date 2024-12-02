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
    public class AdminController(JwtTokenService jwtTokenService, UserManager<User> userManager, SignInManager<User> signInManager, ApplicationDbContext context, RoleManager<IdentityRole> roleManager) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly SignInManager<User> _signInManager = signInManager;
        private readonly JwtTokenService _jwtTokenService = jwtTokenService;
        private readonly ApplicationDbContext _context = context;
        private readonly RoleManager<IdentityRole> _roleManager = roleManager;


        // GET: api/Admin
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = _userManager.Users.ToList();

                var userModels = users.Select(user =>
                {
                    var roles = _userManager.GetRolesAsync(user).Result;
                    return new UserModel
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Role = roles.FirstOrDefault() // Assumes a single role per user
                    };
                }).ToList();

                //var results = await Task.WhenAll(userModels); // Resolve all tasks
                return Ok(userModels);
            }
            catch(Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }

        // POST: api/Admin
        [Authorize(Roles ="Admin")]
        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] UserModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email))
            {
                return BadRequest(new { message = "Invalid user data." });
            }

            var user = new User
            {
                Email = model.Email,
                UserName = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };

            var result = await _userManager.CreateAsync(user, "Berda123!"); // Replace with actual logic

            if (!result.Succeeded)
            {
                return BadRequest(new { message = result.Errors.ToString() });
            }

            if (!string.IsNullOrEmpty(model.Role) && model.Role != "Admin")
            {
                await _userManager.AddToRoleAsync(user, model.Role);
            }

            return Ok(new { message = "User added successfully." });
        }
        // PUT: api/Admin/edit
        [Authorize(Roles = "Admin")]
        [HttpPut("edit")]
        public async Task<IActionResult> UpdateUser([FromBody] UserModel model)
        {
            if (string.IsNullOrEmpty(model.FirstName) || string.IsNullOrEmpty(model.LastName))
            {
                return BadRequest(new { message = "First Name and Last Name are required." });
            }

            // Find the user by Id
            var user = await _userManager.FindByIdAsync(model.Id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            user.UserName = model.Email;
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;

            if (!string.IsNullOrEmpty(model.Role) && model.Role != "Admin")
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRoles);

                if (await _roleManager.RoleExistsAsync(model.Role))
                {
                    await _userManager.AddToRoleAsync(user, model.Role);
                }
                else
                {
                    return BadRequest(new { message = "Role does not exist." });
                }
            }

            // Save the changes
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return BadRequest(new { message = "Failed to update user data." });
            }

            return Ok(new { message = "User data updated successfully." });
        }

        // DELETE: api/Admin/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                if (await _userManager.IsInRoleAsync(user, "Admin"))
                {
                    return BadRequest("Cannot delete admin users.");
                }

                var result = await _userManager.DeleteAsync(user);
                if (result.Succeeded)
                {
                    return Ok(new { message = "User deleted successfully." });
                }

                return BadRequest(new { message = result.Errors.ToString() });
            }
            catch(Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }

    }
}
