using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Entities
{
    public class Student
    {
        [Key]
        public int StudentID { get; set; }

        [ForeignKey("Group")]
        public int GroupID { get; set; }

        public virtual Group Group { get; set; }
        public virtual ICollection<ScheduleRequest> ScheduleRequests { get; set; }
    }
}
