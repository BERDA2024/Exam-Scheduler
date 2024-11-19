using ExamScheduler.Server.Source.Entities;
using ExamScheduler.Server.Source.Models;

using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.DataBase
{
    public class ApplicationDbContext : DbContext
    {
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
