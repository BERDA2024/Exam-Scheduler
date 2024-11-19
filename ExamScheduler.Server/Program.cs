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
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy.WithOrigins("https://localhost:3000")  // Asigură-te că acest URL este corect pentru front-end-ul tău
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });


            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseCors("AllowReactApp");  // Permite cererile CORS de la React
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
