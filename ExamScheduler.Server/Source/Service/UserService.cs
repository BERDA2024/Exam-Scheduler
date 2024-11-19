using System;
using System.Threading.Tasks;

using BCrypt.Net;

using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Models;
using Microsoft.CodeAnalysis.Scripting;


namespace ExamScheduler.Server.Source.Service

{
    public class UserService
    {

        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddUser(string name, string email, string password, int? groupId = null)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Name, email, and password are required.");
            }

            // Determinăm rolul pe baza email-ului
            string role;
            if (email.Contains("@student"))
            {
                role = "student";
            }
            else if (email.Contains("@usm"))
            {
                role = "professor";
            }
            else
            {
                throw new ArgumentException("Email-ul nu este valid pentru niciun rol.");
            }

            // Dacă este student, `groupId` trebuie specificat
            if (role == "student" && groupId == null)
            {
                throw new ArgumentException("GroupId este necesar pentru studenți.");
            }

            // Criptăm parola cu BCrypt
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            // Creăm obiectul `User`
            var user = new User
            {
                name = name,
                email = email,
                password = hashedPassword,
                role = role,
                group_id = role == "student" ? groupId : null
            };

            // Adăugăm utilizatorul în baza de date
            _context.User.Add(user);
            await _context.SaveChangesAsync();

        }
    }
}
