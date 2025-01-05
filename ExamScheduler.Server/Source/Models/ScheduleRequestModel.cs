using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class ScheduleRequestModel
    {
        public int Id { get; set; }
        public string? SubjectName { get; set; }

        [Required(ErrorMessage = "StudentID is required.")]
        public int StudentID { get; set; }

        [Required(ErrorMessage = "RequestStateID is required.")]
        public int RequestStateID { get; set; }

        public string? ClassroomName { get; set; }

        [Required(ErrorMessage = "StartDate is required.")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "ExamDuration is required.")]
        public int ExamDuration { get; set; }

        [Required(ErrorMessage = "ExamType is required.")]
        [StringLength(50, ErrorMessage = "ExamType cannot exceed 50 characters.")]
        public string ExamType { get; set; }

        public string? RejectionReason { get; set; }
    }
}
