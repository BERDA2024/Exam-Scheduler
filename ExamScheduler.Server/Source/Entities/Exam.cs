using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Entities
{
    public class Exam
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Subject { get; set; }

        [Required]
        public DateTime ScheduledDate { get; set; }

        [Required]
        public int RoomId { get; set; }

        [Required]
        public int ProfessorId { get; set; }

        [Range(1, 500)]
        public int Capacity { get; set; }

        public virtual Room Room { get; set; }
        public virtual Professor Professor { get; set; }
    }

}
