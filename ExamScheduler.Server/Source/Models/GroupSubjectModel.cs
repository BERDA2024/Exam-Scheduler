using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class GroupSubjectModel
    {
        public int Id { get; set; } // ID pentru identificare

        [Required(ErrorMessage = "SubjectID is required.")]
        public int SubjectID { get; set; } // ID-ul materiei asociate

        [Required(ErrorMessage = "GroupID is required.")]
        public int GroupID { get; set; } // ID-ul grupului asociat
    }
}
