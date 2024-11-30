using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Domain
{
    public class Classroom
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string Name { get; set; }
        [Required]

        [StringLength(100)]
        public required string ShortName { get; set; }

        [StringLength(100)]
        public required string BuildingName { get; set; }
    }
}
