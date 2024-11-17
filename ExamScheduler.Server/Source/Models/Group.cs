using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class Group
    {
        [Key]
        public int GroupID { get; set; }

        [ForeignKey("Specialization")]
        public int SpecializationID { get; set; }

        public int Year { get; set; }

        public virtual Specialization Specialization { get; set; }
        public virtual ICollection<Student> Students { get; set; }
    }
}
