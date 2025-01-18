using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class GroupSubjectModel
    {
        public int Id { get; set; } // ID pentru identificare

        [Required(ErrorMessage = "Subject is required.")]
        public string SubjectName { get; set; } = string.Empty; // ID-ul materiei asociate

        [Required(ErrorMessage = "Group is required.")]
        public string GroupName { get; set; } = string.Empty; // ID-ul grupului asociat
    }
}
