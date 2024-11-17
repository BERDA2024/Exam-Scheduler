using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class RequestState
    {
        [Key]
        public int RequestStateID { get; set; }

        [Required]
        [StringLength(50)]
        public string State { get; set; }

        public virtual ICollection<ScheduleRequest> ScheduleRequests { get; set; }
    }
}
