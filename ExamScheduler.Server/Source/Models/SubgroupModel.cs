using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class SubgroupModel
    {
        public int Id { get; set; } // ID pentru identificare

        [Required(ErrorMessage = "GroupId is required.")]
        public int GroupId { get; set; } // ID-ul grupului asociat

        [Required(ErrorMessage = "SubgroupIndex is required.")]
        [StringLength(1, ErrorMessage = "SubgroupIndex must be a single character.")]
        public string SubgroupIndex { get; set; } = string.Empty; // Indexul subgrupului
    }
}
