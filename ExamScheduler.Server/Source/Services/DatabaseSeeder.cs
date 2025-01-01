using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Domain.Enums;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using System.Text.Json;

namespace ExamScheduler.Server.Source.Services
{
    public class DatabaseSeeder
    {
        // The Seed method doesn't need to be static anymore, and it will receive MigrationBuilder as a parameter.
        public static void Seed(MigrationBuilder migrationBuilder)
        {
            string scriptsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "Scripts");

            // Ensure the folder exists
            if (Directory.Exists(scriptsFolderPath))
            {
                // Get all .sql files in the folder
                var sqlFiles = Directory.GetFiles(scriptsFolderPath, "*.sql");

                foreach (var filePath in sqlFiles)
                {
                    // Read each SQL script file
                    var script = File.ReadAllText(filePath);

                    // Output the script for debugging purposes
                    Console.WriteLine($"Executing script: {filePath}");

                    // Execute the script via migration builder
                    // Use ExecuteSqlRaw to run the script within the migration process
                    migrationBuilder.Sql(script);
                }
            }
        }

        public static async Task SeedUsersAsync(UserManager<User> userManager, ApplicationDbContext context)
        {
            // Create default admin
            var adminEmail = "admin@admin.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new User
                {
                    FirstName = "Administrator",
                    LastName = "System",
                    Email = adminEmail,
                    UserName = adminEmail
                };
                var result = await userManager.CreateAsync(adminUser, "Berda123!");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, RoleType.Admin.ToString());
                }
            }

            var jsonFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "professors.json");
            if (!File.Exists(jsonFilePath))
            {
                throw new FileNotFoundException($"JSON file not found at {jsonFilePath}");
            }

            var jsonData = File.ReadAllText(jsonFilePath);
            var usersData = JsonSerializer.Deserialize<List<ProfessorSeedModel>>(jsonData);

            if (usersData == null || usersData.Count == 0) return;

            var facultyId = 1;
            var defaultPassword = "Berda123!";

            foreach (var userData in usersData)
            {
                var dbUser = await userManager.FindByEmailAsync(userData.emailAddress);

                if (dbUser != null) continue;

                var user = new User
                {
                    FirstName = userData.firstName,
                    LastName = userData.lastName,
                    Email = userData.emailAddress,
                    UserName = userData.emailAddress,
                };
                var result = await userManager.CreateAsync(user, defaultPassword);

                if (!result.Succeeded) continue;

                await userManager.AddToRoleAsync(user, RoleType.Professor.ToString());
                var userId = await userManager.GetUserIdAsync(user);
                var existingProfessor = context.Professor.FirstOrDefault(p => p.UserId == userId);

                if (existingProfessor != null) continue;

                // Add Professor Entry
                context.Professor.Add(new Professor
                {
                    UserId = userId,
                    FacultyId = facultyId,
                });
            }
            context.SaveChanges();
        }
    }
}