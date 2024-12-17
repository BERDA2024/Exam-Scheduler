using ExamScheduler.Server.Source.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ExamScheduler.Server.Source.Services;
using Microsoft.EntityFrameworkCore;
using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Models;
using ExamScheduler.Server.Source.Domain.Enums;
using NuGet.Protocol.Plugins;

namespace ExamScheduler.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController(JwtTokenService jwtTokenService, UserManager<User> userManager, SignInManager<User> signInManager, ApplicationDbContext context, RoleManager<IdentityRole> roleManager, RolesService userRoleService) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly SignInManager<User> _signInManager = signInManager;
        private readonly JwtTokenService _jwtTokenService = jwtTokenService;
        private readonly ApplicationDbContext _context = context;
        private readonly RoleManager<IdentityRole> _roleManager = roleManager;
        private readonly RolesService _userRoleService = userRoleService;

        // GET: api/Admin
        [HttpGet]
        public IActionResult GetUsers()
        {
            try
            {
                var users = _userManager.Users.ToList();

                var userModels = users.Select(user =>
                {
                    var roles = _userManager.GetRolesAsync(user).Result;
                    var facultyId = _userRoleService.GetFacultyIdByRole(user).Result;
                    var facultyName = string.Empty;

                    if (facultyId != null)
                    {
                        var faculty = _context.Faculty.FirstOrDefault(f => f.Id == facultyId);

                        if (faculty != null) facultyName = faculty.ShortName;
                    }

                    return new UserModel
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Role = roles.FirstOrDefault(), // Assumes a single role per user
                        Faculty = facultyName
                    };
                }).ToList();

                //var results = await Task.WhenAll(userModels); // Resolve all tasks
                return Ok(userModels);
            }
            catch (Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }

        // GET: api/Admin
        [HttpGet("byRole")]
        [Authorize(Roles = "Admin,FacultyAdmin,Secretary")]
        public async Task<IActionResult> GetUsersByRole()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

                if (userId == null) return BadRequest(new { message = "User not found" });

                var user = await _userManager.FindByIdAsync(userId);

                if (user == null) return BadRequest(new { message = "User not found" });

                var userRole = await _userManager.GetRolesAsync(user);

                if (userRole == null || userRole.Count == 0) return BadRequest(new { message = "Not authorized" });

                var availableRoles = await _userRoleService.GetSubRoles(user);

                if (availableRoles == null) return NotFound(new { message = "Roles not found" });

                var currentUserFacultyId = await _userRoleService.GetFacultyIdByRole(user);
                var currentFacultyName = string.Empty;
                var users = _userManager.Users.ToList();

                if (currentUserFacultyId != null)
                {
                    var faculty = _context.Faculty.FirstOrDefault(f => f.Id == currentUserFacultyId);

                    if (faculty != null) currentFacultyName = faculty.ShortName;
                }

                var userModels = users.Select(user =>
                {
                    var roles = _userManager.GetRolesAsync(user).Result;
                    var facultyId = _userRoleService.GetFacultyIdByRole(user).Result;
                    var facultyName = string.Empty;

                    if (facultyId != null)
                    {
                        var faculty = _context.Faculty.FirstOrDefault(f => f.Id == facultyId);

                        if (faculty != null) facultyName = faculty.ShortName;
                    }

                    return new UserModel
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Role = roles.FirstOrDefault(), // Assumes a single role per user
                        Faculty = facultyName
                    };
                })
                .Where(userModel => (availableRoles
                    .Select(role => Enum.GetName(role))
                    .Contains(userModel.Role)
                    || string.IsNullOrEmpty(userModel.Role)))
                .ToList();

                if (!userRole.Contains("Admin"))
                {
                    userModels = userModels.Where(userModel => userModel.Faculty == currentFacultyName).ToList();
                }

                return Ok(userModels);
            }
            catch (Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }

        // POST: api/Admin
        [Authorize(Roles = "Admin,FacultyAdmin")]
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


            var activeUserId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

            if (activeUserId == null) return BadRequest(new { message = "User not found" });

            var activeUser = await _userManager.FindByIdAsync(activeUserId);

            if (activeUser == null) return BadRequest(new { message = "User not found" });

            var activeUserRole = await _userManager.GetRolesAsync(activeUser);

            var facultyId = (int?)null;
            if (activeUserRole.Contains(RoleType.FacultyAdmin.ToString()))
                facultyId = await _userRoleService.GetFacultyIdByRole(activeUser);
            if (activeUserRole.Contains(RoleType.Admin.ToString()))
            {
                var faculty = await _context.Faculty.FirstOrDefaultAsync(x => x.ShortName == model.Faculty);
                facultyId = faculty?.Id;
            }

            if (!string.IsNullOrEmpty(model.Role) && model.Role != "Admin") await _userRoleService.ChangeUserRole(user, model.Role, facultyId);

            return Ok(new { message = "User added successfully." });
        }

        // PUT: api/Admin/edit
        [Authorize(Roles = "Admin,FacultyAdmin,Secretary")]
        [HttpPut("edit")]
        public async Task<IActionResult> UpdateUser([FromBody] UserModel model)
        {
            if (string.IsNullOrEmpty(model.FirstName) || string.IsNullOrEmpty(model.LastName)) return BadRequest(new { message = "First Name and Last Name are required." });

            var selectedUser = await _userManager.FindByIdAsync(model.Id);

            if (selectedUser == null) return NotFound(new { message = "User not found." });

            var activeUserId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get user ID from the JWT

            if (activeUserId == null) return BadRequest(new { message = "User not found" });

            var activeUser = await _userManager.FindByIdAsync(activeUserId);

            if (activeUser == null) return BadRequest(new { message = "User not found" });

            var activeUserRole = await _userManager.GetRolesAsync(activeUser);

            var userRoles = await _userManager.GetRolesAsync(selectedUser);
            var currentSelecterUserRole = userRoles.FirstOrDefault();

            if (currentSelecterUserRole != null && currentSelecterUserRole != model.Role)
            {
                var facultyId = await _userRoleService.GetFacultyIdByRole(selectedUser);

                await _userRoleService.ChangeUserRole(selectedUser, model.Role, facultyId);
            }

            if (activeUserRole.Contains(RoleType.Admin.ToString()))
            {
                var faculty = await _context.Faculty.FirstOrDefaultAsync(x => x.ShortName == model.Faculty);

                await _userRoleService.ChangeUserFaculty(selectedUser, faculty?.Id);
            }

            selectedUser.UserName = model.Email;
            selectedUser.FirstName = model.FirstName;
            selectedUser.LastName = model.LastName;
            var updateResult = await _userManager.UpdateAsync(selectedUser);

            if (!updateResult.Succeeded) return BadRequest(new { message = "Failed to update user data." });

            return Ok(new { message = "User data updated successfully." });
        }

        // DELETE: api/Admin/{id}
        [Authorize(Roles = "Admin,FacultyAdmin")]
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
            catch (Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }

        // GET: api/Admin/faculties
        [HttpGet("faculties")]
        public async Task<IActionResult> GetFaculties()
        {
            try
            {
                var faculties = await _context.Faculty.ToListAsync();

                return Ok(faculties);
            }
            catch (Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }

        // DELETE: api/Admin/faculties/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("faculties/{id}")]
        public async Task<IActionResult> DeleteFaculty(int id)
        {
            try
            {
                var faculty = await _context.Faculty.FindAsync(id);

                if (faculty == null)
                {
                    return NotFound(new { message = "Not found" });
                }

                _context.Faculty.Remove(faculty);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Faculty deleted successfully." });
            }
            catch (Exception error)
            {
                return BadRequest(new { message = error.ToString() });
            }
        }

        // POST: api/Admin/faculties
        [Authorize(Roles = "Admin")]
        [HttpPost("faculties")]
        public async Task<IActionResult> AddFaculty([FromBody] Faculty model)
        {
            if (model == null)
            {
                return BadRequest(new { message = "Faculty cannot be null." });
            }

            _context.Faculty.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Successfully added." });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("faculties/edit")]
        public async Task<IActionResult> EditFaculty([FromBody] Faculty updatedFaculty)
        {
            var existingFaculty = await _context.Faculty.FindAsync(updatedFaculty.Id);

            if (existingFaculty == null) return NotFound(new { message = "Faculty not found." });

            existingFaculty.ShortName = updatedFaculty.ShortName;
            existingFaculty.LongName = updatedFaculty.LongName;

            _context.Faculty.Update(existingFaculty);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Successfully changed." });
        }
    }
}
