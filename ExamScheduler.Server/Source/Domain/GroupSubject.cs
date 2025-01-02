using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamScheduler.Server.Source.Domain
{
    public class GroupSubject
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Subject")]
        public int SubjectID { get; set; }

        [Required]
        [ForeignKey("Group")]
        public int GroupID { get; set; }
    }
}
