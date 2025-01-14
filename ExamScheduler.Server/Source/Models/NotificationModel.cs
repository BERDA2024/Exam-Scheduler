namespace ExamScheduler.Server.Source.Models
{
    public class NotificationModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string RecipientName { get; set; } // ID-ul utilizatorului care primește notificarea
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }
    }
}
