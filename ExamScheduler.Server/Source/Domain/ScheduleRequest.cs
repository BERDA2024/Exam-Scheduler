using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Domain
{
    public class ScheduleRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Professor")]
        public int ProfessorID { get; set; }

        [ForeignKey("Student")]
        public int StudentID { get; set; }

        [Required]
        [ForeignKey("Subject")]
        public int SubjectID { get; set; }

        [ForeignKey("RequestState")]
        public int RequestStateID { get; set; }

        [ForeignKey("Classroom")]
        public int ClassroomID { get; set; }

        public DateTime StartDate { get; set; }
    }
}
