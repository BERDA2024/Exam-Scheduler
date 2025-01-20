using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class NotificationService(ApplicationDbContext context)
{
    private readonly ApplicationDbContext _context = context;

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

    // Obține notificările pentru utilizatorul curent
    public async Task<List<NotificationModel>> GetNotificationsForUserAsync(string recipientId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.RecipientId == recipientId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        var notificationsModels = new List<NotificationModel>();

        foreach (var notification in notifications)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == notification.SenderId);

            if (user == null) continue;

            notificationsModels.Add(new NotificationModel
            {
                Id = notification.Id,
                Title = notification.Title,
                Description = notification.Description,
                CreatedAt = notification.CreatedAt,
                IsRead = notification.IsRead,
                RecipientName = user.FirstName + " " + user.LastName,
            });
        }

        return notificationsModels;
    }

    // Șterge o notificare
    public async Task<IActionResult> DeleteNotificationAsync(int notificationId)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId);

        if (notification == null)
        {
            return new NotFoundResult();
        }

        _context.Notifications.Remove(notification);
        await _context.SaveChangesAsync();

        return new OkResult();
    }
}
