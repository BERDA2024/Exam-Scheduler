using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Domain
{
    public class Group
    {
        [Key]
        public int Id { get; set; }


        [ForeignKey("Department")]
        public int DepartmentId { get; set; }

        [Required]
        [StringLength(50)]
        public required string GroupName { get; set; }

        [Required]
        [StringLength(1)]
        public required string SubgroupIndex { get; set; }

        public int StudyYear { get; set; }
    }
}
