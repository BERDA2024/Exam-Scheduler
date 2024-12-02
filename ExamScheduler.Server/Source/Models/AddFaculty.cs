namespace ExamScheduler.Server.Source.Models
{
    public class AddFaculty
    {
        public int Id { get; set; }
        public required string ShortName { get; set; }

        public required string LongName { get; set; }
    }
}
