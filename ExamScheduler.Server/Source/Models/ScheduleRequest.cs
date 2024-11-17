using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class ScheduleRequest
    {
        [Key]
        public int RequestID { get; set; }

        [ForeignKey("Professor")]
        public int ProfessorID { get; set; }

        [ForeignKey("Student")]
        public int StudentID { get; set; }

        [ForeignKey("Subject")]
        public int SubjectID { get; set; }

        [ForeignKey("RequestState")]
        public int RequestStateID { get; set; }

        [ForeignKey("Classroom")]
        public int ClassroomID { get; set; }

        public DateTime StartDate { get; set; }

        public virtual Professor Professor { get; set; }
        public virtual Student Student { get; set; }
        public virtual Subject Subject { get; set; }
        public virtual RequestState RequestState { get; set; }
        public virtual Classroom Classroom { get; set; }
    }
}
