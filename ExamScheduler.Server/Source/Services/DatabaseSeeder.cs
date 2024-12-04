using ExamScheduler.Server.Source.DataBase;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;

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
    }
}