using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly NotificationService _notificationService;

    public NotificationsController(NotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    // Adaugă notificare
    [HttpPost]
    public async Task<IActionResult> AddNotification([FromBody] AddNotificationRequest request)
    {
        await _notificationService.AddNotificationAsync(request.Title, request.Description, request.SenderId, request.RecipientId);
        return Ok();
    }

    // Obține notificările pentru un utilizator
    [HttpGet("{recipientId}")]
    public async Task<IActionResult> GetNotifications(string recipientId)
    {
        var notifications = await _notificationService.GetNotificationsForUserAsync(recipientId);
        return Ok(notifications);
    }

    // Șterge notificare
    [HttpDelete("{notificationId}")]
    public async Task<IActionResult> DeleteNotification(int notificationId, [FromQuery] string recipientId)
    {
        var result = await _notificationService.DeleteNotificationAsync(notificationId, recipientId);

        if (result is OkResult)
        {
            return Ok(); // Notificarea a fost ștearsă cu succes
        }
        else if (result is NotFoundResult)
        {
            return NotFound(); // Notificarea nu a fost găsită
        }

        return BadRequest(); // Dacă există o altă eroare
    }
}

public class AddNotificationRequest
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string SenderId { get; set; }
    public string RecipientId { get; set; }
}
