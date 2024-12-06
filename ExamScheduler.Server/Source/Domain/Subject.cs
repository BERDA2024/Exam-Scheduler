using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Domain
{
    public class Subject
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string LongName { get; set; }

        [Required]
        [StringLength(100)]
        public required string ShortName { get; set; }

        [Required]
        [ForeignKey("Professor")]
        public required int ProfessorID { get; set; }

        [Required]
        [ForeignKey("Department")]
        public required int DepartmentId { get; set; }

        [Required]
        public int ExamDuration { get; set; }

        [Required]
        [StringLength(50)]
        public required string ExamType { get; set; }
    }
}
