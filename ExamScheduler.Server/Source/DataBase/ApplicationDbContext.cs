using ExamScheduler.Server.Source.Models;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.DataBase
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<ScheduleRequest> ScheduleRequest { get; set; } = default!;
        public DbSet<Classroom> Classroom { get; set; } = default!;
        public DbSet<Professor> Professor { get; set; } = default!;
        public DbSet<Address> Address { get; set; } = default!;
        public DbSet<Availability> Availability { get; set; } = default!;
        public DbSet<Country> Country { get; set; } = default!;
        public DbSet<Group> Group { get; set; } = default!;
        public DbSet<Institute> Institute { get; set; } = default!;
        public DbSet<RequestState> RequestState { get; set; } = default!;
        public DbSet<Role> Role { get; set; } = default!;
        public DbSet<Secretary> Secretary { get; set; } = default!;
        public DbSet<Specialization> Specialization { get; set; } = default!;
        public DbSet<Student> Student { get; set; } = default!;
        public DbSet<Subject> Subject { get; set; } = default!;
        public DbSet<User> User { get; set; } = default!;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
