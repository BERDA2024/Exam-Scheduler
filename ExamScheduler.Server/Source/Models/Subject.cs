using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class Subject
    {
        [Key]
        public int SubjectID { get; set; }

        [ForeignKey("Specialization")]
        public int SpecializationID { get; set; }

        [ForeignKey("Professor")]
        public int ProfessorID { get; set; }

        public int ExamDuration { get; set; }

        [StringLength(50)]
        public string ExamType { get; set; }

        public virtual Specialization Specialization { get; set; }
        public virtual Professor Professor { get; set; }
        public virtual ICollection<ScheduleRequest> ScheduleRequests { get; set; }
    }
}
