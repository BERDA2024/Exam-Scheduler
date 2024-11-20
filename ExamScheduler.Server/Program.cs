using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Services;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Adaugă servicii la container
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                 options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<ExamService>(); // Adaugă serviciul ExamService

            builder.Services.AddControllers();
            // Configurare Swagger pentru documentarea API-ului
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Configurare logging suplimentar (opțional)
            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:50733")
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            var app = builder.Build();

            app.UseCors("AllowFrontend");

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseRouting();

            // Configurare pipeline de cereri HTTP
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            // Rute fallback pentru aplicația React/SPA
            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
