using ExamScheduler.Server.Source.DataBase;
using Microsoft.EntityFrameworkCore;


public class NotificationService
{
    private readonly ApplicationDbContext _context;

    public NotificationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddNotificationAsync(string title, string description, string senderId, string recipientId)
    {
        var notification = new Notification
        {
            Title = title,
            Description = description,
            SenderId = senderId,
            RecipientId = recipientId,
            CreatedAt = DateTime.UtcNow,
            IsRead = false
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Notification>> GetNotificationsForUserAsync(string recipientId)
    {
        return await _context.Notifications
            .Where(n => n.RecipientId == recipientId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }
}
