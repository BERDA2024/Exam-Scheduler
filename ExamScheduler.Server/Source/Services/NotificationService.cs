using ExamScheduler.Server.Source.DataBase;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class NotificationService
{
    private readonly ApplicationDbContext _context;

    public NotificationService(ApplicationDbContext context)
    {
        _context = context;
    }

    // Adaugă notificare
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

    // Obține notificările pentru un anumit utilizator
    public async Task<List<Notification>> GetNotificationsForUserAsync(string recipientId)
    {
        return await _context.Notifications
            .Where(n => n.RecipientId == recipientId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    // Șterge o notificare pentru un utilizator specific
    public async Task<IActionResult> DeleteNotificationAsync(int notificationId, string recipientId)
    {
        // Găsește notificarea
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId && n.RecipientId == recipientId);

        if (notification == null)
        {
            return new NotFoundResult(); // Notificarea nu a fost găsită pentru utilizatorul respectiv
        }

        _context.Notifications.Remove(notification);
        await _context.SaveChangesAsync();

        return new OkResult(); // Notificarea a fost ștearsă cu succes
    }
}
