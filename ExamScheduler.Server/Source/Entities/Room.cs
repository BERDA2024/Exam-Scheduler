namespace ExamScheduler.Server.Source.Entities
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Capacity { get; set; }
        public virtual ICollection<Exam> Exam { get; set; }
    }
}
