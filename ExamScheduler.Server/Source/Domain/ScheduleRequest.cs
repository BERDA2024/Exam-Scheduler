using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Domain
{
    public class ScheduleRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Subject")]
        public int SubjectID { get; set; }

        [Required]
        [ForeignKey("Student")]
        public int StudentID { get; set; }

        [Required]
        [ForeignKey("RequestState")]
        public int RequestStateID { get; set; }

        [Required]
        [ForeignKey("Classroom")]
        public int ClassroomID { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public int ExamDuration { get; set; } // Durata examenului în minute

        [Required]
        [StringLength(50)]
        public string ExamType { get; set; } // Tipul examenului (de exemplu, "Oral", "Written")

        public string? RejectionReason { get; set; } // Motivul respingerii (dacă există)

        public Subject Subject { get; set; }
        public Classroom Classroom { get; set; }
    }

}
