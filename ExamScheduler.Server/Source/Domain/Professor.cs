using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Domain
{
    public class Professor
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("User")]
        public required string UserId { get; set; }

        public string? Title {  get; set; }

        [ForeignKey("Faculty")]
        public int? FacultyId { get; set; }
    }
}
