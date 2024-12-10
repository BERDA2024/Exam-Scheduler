namespace ExamScheduler.Server.Source.Models
{
    public class DepartmentModel
    {
        public int Id { get; set; }
        public string ShortName { get; set; }
        public string LongName { get; set; }
        public string? FacultyName { get; set; }
    }
}
