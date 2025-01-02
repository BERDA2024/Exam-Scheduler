using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class UserModel
    {
        public required string Id { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "First Name is required.")]
        public required string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required.")]
        public required string LastName { get; set; }
        public string? Role {  get; set; }
        public string? Faculty { get; set; }
    }
}
