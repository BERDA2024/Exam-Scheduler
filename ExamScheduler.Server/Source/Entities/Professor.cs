namespace ExamScheduler.Server.Source.Entities
{
    public class Professor
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public virtual ICollection<Exam> Exam { get; set; }
    }
}
