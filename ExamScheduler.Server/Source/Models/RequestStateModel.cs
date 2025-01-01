using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class RequestStateModel
    {
        public int Id { get; set; } // ID pentru identificare

        [Required(ErrorMessage = "State is required.")]
        [StringLength(50, ErrorMessage = "State cannot exceed 50 characters.")]
        public string State { get; set; } = string.Empty; // Starea cererii
    }
}
