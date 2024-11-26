using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Domain
{
    public class Student
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public required string UserId { get; set; }

        [ForeignKey("Group")]
        public int GroupID { get; set; }
    }
}
