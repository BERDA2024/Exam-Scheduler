using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Entities
{
    public class Exam
    {
        [Key]
        public int Id { get; set; }
        public string Subject { get; set; }
        public DateTime ScheduledDate { get; set; }
        public int RoomId { get; set; }
        public int ProfessorId { get; set; }
        public int Capacity { get; set; }
        public virtual Room Room { get; set; }
        public virtual Professor Professor { get; set; }
    }
}
