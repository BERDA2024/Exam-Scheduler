using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class GroupModel
    {
        public int Id { get; set; } // ID pentru identificare

        [Required(ErrorMessage = "DepartmentId is required.")]
        public int DepartmentId { get; set; } // ID-ul departamentului asociat

        [Required(ErrorMessage = "GroupName is required.")]
        [StringLength(50, ErrorMessage = "GroupName cannot exceed 50 characters.")]
        public string GroupName { get; set; } = string.Empty; // Numele grupului

        [Required(ErrorMessage = "StudyYear is required.")]
        public int StudyYear { get; set; } // Anul de studiu
    }
}
