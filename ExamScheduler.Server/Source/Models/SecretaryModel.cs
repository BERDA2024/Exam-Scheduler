using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class SecretaryModel
    {
        public int Id { get; set; } // ID pentru identificare

        [Required(ErrorMessage = "UserId is required.")]
        public string UserId { get; set; } = string.Empty; // ID-ul utilizatorului asociat

        public int? FacultyId { get; set; } // ID-ul facultății asociate (poate fi null)
    }
}
