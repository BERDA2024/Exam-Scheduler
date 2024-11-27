using ExamScheduler.Server.Source.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ExamScheduler.Server.Source.DataBase
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<Availability> Availability { get; set; } = default!;
        public DbSet<Classroom> Classroom { get; set; } = default!;
        public DbSet<Department> Department { get; set; } = default!;
        public DbSet<Faculty> Faculty { get; set; } = default!;
        public DbSet<Group> Group { get; set; } = default!;
        public DbSet<Professor> Professor { get; set; } = default!;
        public DbSet<RequestState> RequestState { get; set; } = default!;
        public DbSet<ScheduleRequest> ScheduleRequest { get; set; } = default!;
        public DbSet<Secretary> Secretary { get; set; } = default!;
        public DbSet<Student> Student { get; set; } = default!;
        public DbSet<Subject> Subject { get; set; } = default!;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
