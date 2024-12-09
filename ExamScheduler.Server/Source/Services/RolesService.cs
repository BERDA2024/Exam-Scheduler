using ExamScheduler.Server.Source.Domain.Enums;
using ExamScheduler.Server.Source.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ExamScheduler.Server.Source.DataBase;
using Microsoft.AspNetCore.Mvc;

namespace ExamScheduler.Server.Source.Services
{
    public class RolesService(UserManager<User> userManager, ApplicationDbContext context, RoleManager<IdentityRole> roleManager)
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly ApplicationDbContext _context = context;
        private readonly RoleManager<IdentityRole> _roleManager = roleManager;

        public async Task<int?> GetFacultyIdByRole(User user)
        {
            var student = await GetStudentById(user);
            if (student != null)
                return student.FacultyId;

            var professor = await GetProfessorById(user);
            if (professor != null)
                return professor.FacultyId;

            var secretary = await GetSecretaryById(user);
            if (secretary != null)
                return secretary.FacultyId;

            var facultyAdmin = await GetFacultyAdminById(user);
            if (facultyAdmin != null)
                return facultyAdmin.FacultyId;

            return null;
        }

        public async Task<Student?> GetStudentById(User user)
        {
            var userId = user.Id;
            var userRoles = await _userManager.GetRolesAsync(user);
            var currentRole = userRoles.FirstOrDefault();

            if (currentRole == RoleType.Student.ToString() || currentRole == RoleType.StudentGroupLeader.ToString())
            {
                var existingStudent = await _context.Student.FirstOrDefaultAsync(st => st.UserId == userId);

                if (existingStudent == null) return null;

                return existingStudent;
            }
            return null;
        }

        public async Task<Professor?> GetProfessorById(User user)
        {
            var userId = user.Id;
            var userRoles = await _userManager.GetRolesAsync(user);
            var currentRole = userRoles.FirstOrDefault();

            if (currentRole == RoleType.Professor.ToString())
            {
                var existingProfessor = await _context.Professor.FirstOrDefaultAsync(p => p.UserId == userId);

                if (existingProfessor == null) return null;

                return existingProfessor;
            }
            return null;
        }

        public async Task<Secretary?> GetSecretaryById(User user)
        {
            var userId = user.Id;
            var userRoles = await _userManager.GetRolesAsync(user);
            var currentRole = userRoles.FirstOrDefault();

            if (currentRole == RoleType.Secretary.ToString())
            {
                var existingSecretary = await _context.Secretary.FirstOrDefaultAsync(s => s.UserId == userId);

                if (existingSecretary == null) return null;

                return existingSecretary;
            }

            return null;
        }

        public async Task<FacultyAdmin?> GetFacultyAdminById(User user)
        {
            var userId = user.Id;
            var userRoles = await _userManager.GetRolesAsync(user);
            var currentRole = userRoles.FirstOrDefault();

            if (currentRole == RoleType.FacultyAdmin.ToString())
            {
                var existingFacultyAdmin = await _context.FacultyAdmin.FirstOrDefaultAsync(fa => fa.UserId == userId);

                if (existingFacultyAdmin == null) return null;

                return existingFacultyAdmin;
            }

            return null;
        }

        public async Task<bool> ChangeUserFaculty(User user, int? facultyId = null)
        {

            var student = await GetStudentById(user);

            if (student != null)
            {
                student.FacultyId = facultyId;
                _context.Update(student);
            }

            var professor = await GetProfessorById(user);

            if (professor != null)
            {
                professor.FacultyId = facultyId;
                _context.Update(professor);
            }

            var secretary = await GetSecretaryById(user);

            if (secretary != null)
            {
                secretary.FacultyId = facultyId;
                _context.Update(secretary);
            }

            var facultyAdmin = await GetFacultyAdminById(user);

            if (facultyAdmin != null)
            {
                facultyAdmin.FacultyId = facultyId;
                _context.Update(facultyAdmin);
            }

            var result = await _context.SaveChangesAsync();

            if (result > 0) return true;

            return false;
        }
        public async Task<bool> ChangeUserRole(User user, string newRole, int? facultyId = null)
        {
            var userId = user.Id;
            var userRoles = await _userManager.GetRolesAsync(user);
            var currentRole = userRoles.FirstOrDefault();

            if (string.IsNullOrEmpty(newRole) || newRole == RoleType.Admin.ToString()) return false;

            if (currentRole != null && currentRole != newRole)
            {
                var student = await GetStudentById(user);

                if (student != null) _context.Remove(student);

                var professor = await GetProfessorById(user);

                if (professor != null) _context.Remove(professor);

                var secretary = await GetSecretaryById(user);

                if (secretary != null) _context.Remove(secretary);

                var facultyAdmin = await GetFacultyAdminById(user);

                if (facultyAdmin != null) _context.Remove(facultyAdmin);
            }

            // Handle insertion for the new role if it does not already exist
            if (newRole == RoleType.FacultyAdmin.ToString() && !await _context.FacultyAdmin.AnyAsync(fa => fa.UserId == userId))
            {
                _context.FacultyAdmin.Add(new FacultyAdmin { UserId = userId, FacultyId = facultyId });
            }
            else if (newRole == RoleType.Secretary.ToString() && !await _context.Secretary.AnyAsync(s => s.UserId == userId))
            {
                _context.Secretary.Add(new Secretary { UserId = userId, FacultyId = facultyId });
            }
            else if (newRole == RoleType.Professor.ToString() && !await _context.Professor.AnyAsync(p => p.UserId == userId))
            {
                _context.Professor.Add(new Professor { UserId = userId, Title = null, FacultyId = facultyId });
            }
            else if ((newRole == RoleType.Student.ToString() || newRole == RoleType.StudentGroupLeader.ToString()) &&
                     !await _context.Student.AnyAsync(st => st.UserId == userId))
            {
                _context.Student.Add(new Student { UserId = userId, SubgroupID = null });
            }

            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                await _userManager.RemoveFromRolesAsync(user, userRoles);

                if (await _roleManager.RoleExistsAsync(newRole))
                {
                    await _userManager.AddToRoleAsync(user, newRole);
                }
                return true;
            }

            return false;
        }
    }
}
