using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            // Configure DbContext with SQL Server and connection string from configuration
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Add Identity services for Authentication and Authorization
            builder.Services.AddIdentity<User, IdentityRole>(options =>
            {
                // Configure Identity options if necessary (e.g., password policy)
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.AllowedForNewUsers = true;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()  // Use your ApplicationDbContext to store Identity data
            .AddDefaultTokenProviders(); // This allows generating tokens (e.g., for email confirmation)
            
            builder.Services.AddControllers();

            // Swagger setup for API documentation
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Serve static files (for example, if you're serving an Angular or React app)
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Use HTTPS Redirection and authentication/authorization middleware
            app.UseHttpsRedirection();
            app.UseAuthentication();  // Add Authentication Middleware
            app.UseAuthorization();   // Add Authorization Middleware

            // Map controllers for your API
            app.MapControllers();

            // Fallback to index.html for Single Page Applications (SPA)
            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}