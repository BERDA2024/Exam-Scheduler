using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamScheduler.Server.Source.Domain
{
    public class Subgroup
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Group")]
        public required int GroupId { get; set; }

        [Required]
        [StringLength(1)]
        public required string SubgroupIndex { get; set; }
    }
}
