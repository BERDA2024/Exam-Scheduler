using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class ScheduleRequestModel
    {
        public int Id { get; set; } // ID pentru identificare

        public string? SubjectName { get; set; } // Numele materiei (pentru frontend)

        [Required(ErrorMessage = "StudentID is required.")]
        public int StudentID { get; set; } // ID-ul studentului

        [Required(ErrorMessage = "RequestStateID is required.")]
        public int RequestStateID { get; set; } // ID-ul stării cererii

        public string? ClassroomName { get; set; } // Numele sălii (pentru frontend)

        [Required(ErrorMessage = "StartDate is required.")]
        public DateTime StartDate { get; set; } // Data și ora începutului
    }
}
