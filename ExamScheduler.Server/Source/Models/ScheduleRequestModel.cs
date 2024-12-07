using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class ScheduleRequestModel
    {
        public int Id { get; set; } // ID pentru identificare

        [Required(ErrorMessage = "SubjectID is required.")]
        public int SubjectID { get; set; } // ID-ul materiei asociate

        [Required(ErrorMessage = "StudentID is required.")]
        public int StudentID { get; set; } // ID-ul studentului

        [Required(ErrorMessage = "RequestStateID is required.")]
        public int RequestStateID { get; set; } // ID-ul stării cererii

        [Required(ErrorMessage = "ClassroomID is required.")]
        public int ClassroomID { get; set; } // ID-ul sălii

        [Required(ErrorMessage = "StartDate is required.")]
        public DateTime StartDate { get; set; } // Data și ora începutului
    }
}
