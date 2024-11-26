using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Domain
{
    public class RequestState
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public required string State { get; set; }
    }
}
