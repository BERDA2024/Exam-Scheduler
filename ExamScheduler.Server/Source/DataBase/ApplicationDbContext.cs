﻿using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Domain.Enums;
using ExamScheduler.Server.Source.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ExamScheduler.Server.Source.DataBase
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<User>(options)
    {
        public DbSet<Availability> Availability { get; set; } = default!;
        public DbSet<Classroom> Classroom { get; set; } = default!;
        public DbSet<Department> Department { get; set; } = default!;
        public DbSet<Faculty> Faculty { get; set; } = default!;
        public DbSet<FacultyAdmin> FacultyAdmin { get; set; } = default!;
        public DbSet<Group> Group { get; set; } = default!;
        public DbSet<GroupSubject> GroupSubject { get; set; } = default!;
        public DbSet<Professor> Professor { get; set; } = default!;
        public DbSet<RequestState> RequestState { get; set; } = default!;
        public DbSet<ScheduleRequest> ScheduleRequest { get; set; } = default!;
        public DbSet<Subgroup> Subgroup { get; set; } = default!;
        public DbSet<Secretary> Secretary { get; set; } = default!;
        public DbSet<Student> Student { get; set; } = default!;
        public DbSet<Subject> Subject { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            foreach (var state in Enum.GetValues<RequestStates>())
            {
                modelBuilder.Entity<RequestState>().HasData(
                    new RequestState { Id = (int)state, State = state.ToString() }
                );
            }
        }
    }
}
