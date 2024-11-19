using ExamScheduler.Server.Source.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.DataBase
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Exam> Exam { get; set; } = default!;
        public DbSet<Room> Room { get; set; } = default!;
        public DbSet<Professor> Professor { get; set; } = default!;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurare relații
            modelBuilder.Entity<Exam>()
                .HasOne(e => e.Room)
                .WithMany(r => r.Exam)
                .HasForeignKey(e => e.RoomId)
                .OnDelete(DeleteBehavior.Cascade); // Ștergerea examenelor când Room este ștearsă.

            modelBuilder.Entity<Exam>()
                .HasOne(e => e.Professor)
                .WithMany(p => p.Exam)
                .HasForeignKey(e => e.ProfessorId)
                .OnDelete(DeleteBehavior.Cascade); // Ștergerea examenelor când Professor este șters.

            // Exemplu de seeding
            modelBuilder.Entity<Room>().HasData(
                new Room { Id = 1, Name = "Room A", Capacity = 30 },
                new Room { Id = 2, Name = "Room B", Capacity = 20 }
            );

            modelBuilder.Entity<Professor>().HasData(
                new Professor { Id = 1, Name = "Prof. John Doe", Email = "john.doe@example.com" },
                new Professor { Id = 2, Name = "Prof. Jane Smith", Email = "jane.smith@example.com" }
            );

            modelBuilder.Entity<Exam>().HasData(
                new Exam
                {
                    Id = 1,
                    Subject = "Mathematics",
                    ScheduledDate = DateTime.Now.AddDays(7),
                    RoomId = 1,
                    ProfessorId = 1,
                    Capacity = 25
                },
                new Exam
                {
                    Id = 2,
                    Subject = "Physics",
                    ScheduledDate = DateTime.Now.AddDays(10),
                    RoomId = 2,
                    ProfessorId = 2,
                    Capacity = 20
                }
            );
        }
    }
}
