using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Domain
{
    public class Group
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Department")]
        public required int DepartmentId { get; set; }

        [Required]
        [StringLength(50)]
        public required string GroupName { get; set; }

        [Required]
        public required int StudyYear { get; set; }
    }
}
