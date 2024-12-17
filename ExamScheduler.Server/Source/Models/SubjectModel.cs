using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class SubjectModel
    {
        public int Id { get; set; } // ID pentru identificare

        [Required(ErrorMessage = "LongName is required.")]
        [StringLength(100, ErrorMessage = "LongName can't be longer than 100 characters.")]
        public string LongName { get; set; } = string.Empty; // Numele complet al materiei

        [Required(ErrorMessage = "ShortName is required.")]
        [StringLength(100, ErrorMessage = "ShortName can't be longer than 100 characters.")]
        public string ShortName { get; set; } = string.Empty; // Numele scurt al materiei

        [Required(ErrorMessage = "ProfessorID is required.")]
        public int ProfessorID { get; set; } // ID-ul profesorului asociat

        [Required(ErrorMessage = "DepartmentId is required.")]
        public int DepartmentId { get; set; } // ID-ul departamentului asociat

        [Required(ErrorMessage = "ExamDuration is required.")]
        public int ExamDuration { get; set; } // Durata examenului (în minute)

        [Required(ErrorMessage = "ExamType is required.")]
        [StringLength(50, ErrorMessage = "ExamType can't be longer than 50 characters.")]
        public string ExamType { get; set; } = string.Empty; // Tipul examenului
    }
}
