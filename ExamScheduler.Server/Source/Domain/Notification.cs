namespace ExamScheduler.Server.Source.Domain
{
    public class Notification
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string SenderId { get; set; } // User ID care a trimis
        public string RecipientId { get; set; } // User ID care primește
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }
    }
}