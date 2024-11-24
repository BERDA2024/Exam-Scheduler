using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.IO;
using System.Text;

namespace ExamScheduler.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Add Identity services for Authentication and Authorization
            builder.Services.AddIdentity<User, IdentityRole>(options =>
            {
                // Password settings.
                options.Password.RequiredUniqueChars = 1;
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.AllowedForNewUsers = true;
                options.SignIn.RequireConfirmedAccount = false;

                // Lockout settings.
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;

                // User settings.
                options.User.AllowedUserNameCharacters =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
                options.User.RequireUniqueEmail = false;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            builder.Services.ConfigureApplicationCookie(options =>
            {
                // Cookie settings
                options.Cookie.HttpOnly = true;
                options.ExpireTimeSpan = TimeSpan.FromMinutes(5);

                options.LoginPath = "/Identity/Account/Login";
                options.AccessDeniedPath = "/Identity/Account/AccessDenied";
                options.SlidingExpiration = true;
            });

            // JWT Authentication setup
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true,
                            ValidIssuer = builder.Configuration["Jwt:Issuer"],
                            ValidAudience = builder.Configuration["Jwt:Audience"],
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"])) // Ensure this key is 256 bits
                        };
                    });

            builder.Services.AddSingleton<JwtTokenService>(); // Register the JwtTokenService
            builder.Services.AddControllers();

            // Add CORS services and configure the policy
            builder.Services.AddCors(options =>
            {

                options.AddDefaultPolicy(
                    policy =>
                    {
                        policy.WithOrigins("https://localhost:50733")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            //.AllowAnyOrigin();
                            .AllowCredentials();
                    });
            });

            // Swagger setup for API documentation
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Use CORS middleware globally (for all routes)
            app.UseCors();

            // Serve static files (for example, if you're serving an Angular or React app)
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();

                // Proxy to Vite dev server when in development mode
                app.UseWhen(context => context.Request.Path.StartsWithSegments("/"), appBuilder =>
                {
                    appBuilder.Run(async context =>
                    {
                        // Forward all requests to the Vite dev server
                        var viteDevServerUrl = "http://localhost:5173"; // Change if Vite is running on a different port
                        var url = viteDevServerUrl + context.Request.Path + context.Request.QueryString;
                        context.Response.Redirect(url);
                        await Task.CompletedTask;
                    });
                });
            }
            else
            {
                // In production, serve static files from the 'dist' folder after building React app with Vite
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "ClientApp", "dist")),
                    RequestPath = ""
                });
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