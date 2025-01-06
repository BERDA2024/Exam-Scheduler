using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class SubgroupModel
    {
        public int Id { get; set; } // ID pentru identificare

        [Required(ErrorMessage = "Group Name is required.")]
        [StringLength(50, ErrorMessage = "GroupName cannot exceed 50 characters.")]
        public string GroupName { get; set; } = string.Empty;  // ID-ul grupului asociat

        [Required(ErrorMessage = "SubgroupIndex is required.")]
        [StringLength(1, ErrorMessage = "SubgroupIndex must be a single character.")]
        public string SubgroupIndex { get; set; } = string.Empty; // Indexul subgrupului

        public string FullName { get; set; } = string.Empty;
    }
}
