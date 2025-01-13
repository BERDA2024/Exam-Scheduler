using System.ComponentModel.DataAnnotations;

namespace ExamScheduler.Server.Source.Models
{
    public class AddSubjectModel
    {
        public int Id { get; set; } // ID pentru identificare

        [Required(ErrorMessage = "LongName is required.")]
        [StringLength(100, ErrorMessage = "LongName can't be longer than 100 characters.")]
        public string LongName { get; set; } = string.Empty; // Numele complet al materiei

        [Required(ErrorMessage = "ShortName is required.")]
        [StringLength(100, ErrorMessage = "ShortName can't be longer than 100 characters.")]
        public string ShortName { get; set; } = string.Empty; // Numele scurt al materiei

        [Required(ErrorMessage = "Professor is required.")]
        public string ProfessorName { get; set; } = string.Empty; // ID-ul profesorului asociat

        [Required(ErrorMessage = "Department is required.")]
        public string DepartmentShortName { get; set; } = string.Empty; // ID-ul departamentului asociat

        [Required(ErrorMessage = "ExamDuration is required.")]
        public int ExamDuration { get; set; } // Durata examenului (în minute)

        [Required(ErrorMessage = "ExamType is required.")]
        [StringLength(50, ErrorMessage = "ExamType can't be longer than 50 characters.")]
        public string ExamType { get; set; } = string.Empty; // Tipul examenului
    }
}
