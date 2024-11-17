using ExamScheduler.Server.Source.Models;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.DataBase
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<ScheduleRequest> ScheduleRequest { get; set; }
        public DbSet<Classroom> Classroom { get; set; }
        public DbSet<Professor> Professor { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        public DbSet<ExamScheduler.Server.Source.Models.Address> Address { get; set; } = default!;
    }
}
