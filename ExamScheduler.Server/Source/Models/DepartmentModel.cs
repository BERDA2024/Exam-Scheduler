using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class DepartmentModel
    {
        public int Id { get; set; } // ID-ul este necesar pentru identificare

        [Required(ErrorMessage = "LongName is required.")]
        [StringLength(100, ErrorMessage = "LongName cannot exceed 100 characters.")]
        public string LongName { get; set; } = string.Empty;

        [Required(ErrorMessage = "ShortName is required.")]
        [StringLength(50, ErrorMessage = "ShortName cannot exceed 50 characters.")]
        public string ShortName { get; set; } = string.Empty;

        public string? FacultyName { get; set; } 
    }
}
