using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Domain
{
    public class Faculty
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string ShortName { get; set; }

        [Required]
        [StringLength(100)]
        public required string LongName { get; set; }
    }
}
