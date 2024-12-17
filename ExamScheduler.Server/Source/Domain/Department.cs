using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamScheduler.Server.Source.Domain
{
    public class Department
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string LongName { get; set; }

        [Required]
        [StringLength(50)]
        public required string ShortName { get; set; }

        [ForeignKey("Faculty")]
        public int? FacultyId { get; set; }
    }
}
