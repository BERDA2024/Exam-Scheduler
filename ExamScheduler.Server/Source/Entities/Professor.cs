using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Entities
{
    public class Professor
    {
        [Key]
        public int ProfessorID { get; set; }

        [ForeignKey("User ")]
        public int UserID { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<Availability> Availabilities { get; set; }
        public virtual ICollection<Subject> Subjects { get; set; }
        public virtual ICollection<ScheduleRequest> ScheduleRequests { get; set; }
    }
}
