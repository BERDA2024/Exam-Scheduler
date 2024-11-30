using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Domain
{
    public class Subject
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Professor")]
        public required int ProfessorID { get; set; }

        [Required]
        [ForeignKey("Department")]
        public required int DepartmentId { get; set; }

        public int ExamDuration { get; set; }

        [StringLength(50)]
        public required string ExamType { get; set; }
    }
}
