using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Domain
{
    public class Role
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public required string Name { get; set; }

        [StringLength(255)]
        public required string Description { get; set; }
    }

    public enum RoleType
    {
        Admin = 1,
        Secretary = 2,
        Professor = 3,
        Student = 4,
        StudentGroupLeader = 5
    }
}
