namespace ExamScheduler.Server.Source.Models
{
    public class ScheduleRequestModel
    {
        public string Subject { get; set; }
        public string Classroom { get; set; }
        public DateTime StartDate { get; set; }
    }
}
