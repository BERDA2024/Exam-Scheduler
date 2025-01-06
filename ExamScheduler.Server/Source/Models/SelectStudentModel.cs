namespace ExamScheduler.Server.Source.Models
{
    public class SelectStudentModel
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty; // The student full nam
        public string Email { get; set; } = string.Empty; // The student full name
        public string? FullGroupName { get; set; } = string.Empty; // The group name
    }
}
