using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class FacultyModel
    {
        public int Id { get; set; } // ID pentru identificare

        [Required(ErrorMessage = "ShortName is required.")]
        [StringLength(100, ErrorMessage = "ShortName cannot exceed 100 characters.")]
        public string ShortName { get; set; } = string.Empty;

        [Required(ErrorMessage = "LongName is required.")]
        [StringLength(100, ErrorMessage = "LongName cannot exceed 100 characters.")]
        public string LongName { get; set; } = string.Empty;
    }
}
