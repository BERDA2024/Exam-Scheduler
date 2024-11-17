using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Entities
{
    public class Specialization
    {
        [Key]
        public int SpecializationID { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        public virtual ICollection<Group> Groups { get; set; }
        public virtual ICollection<Subject> Subjects { get; set; }
    }
}
