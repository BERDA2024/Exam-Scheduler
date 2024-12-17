using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class ClassroomModel
    {
        public int Id { get; set; } // ID-ul poate fi opțional în scenarii de creare

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "ShortName is required.")]
        [StringLength(100, ErrorMessage = "ShortName cannot exceed 100 characters.")]
        public string ShortName { get; set; } = string.Empty;

        [Required(ErrorMessage = "BuildingName is required.")]
        [StringLength(100, ErrorMessage = "BuildingName cannot exceed 100 characters.")]
        public string BuildingName { get; set; } = string.Empty;
    }
}
