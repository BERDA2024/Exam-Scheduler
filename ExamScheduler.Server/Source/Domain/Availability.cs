using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Domain
{
    public class Availability
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Professor")]
        public int ProfessorID { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
