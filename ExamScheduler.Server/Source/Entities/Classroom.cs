using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Entities
{
    public class Classroom
    {
        [Key]
        public int ClassroomID { get; set; }

        public int Capacity { get; set; }

        [StringLength(100)]
        public string Location { get; set; }

        public virtual ICollection<ScheduleRequest> ScheduleRequests { get; set; }
    }
}
