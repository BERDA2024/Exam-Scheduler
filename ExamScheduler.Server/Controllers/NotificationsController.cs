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

    [HttpPost]
    public async Task<IActionResult> AddNotification([FromBody] AddNotificationRequest request)
    {
        await _notificationService.AddNotificationAsync(request.Title, request.Description, request.SenderId, request.RecipientId);
        return Ok();
    }

    [HttpGet("{recipientId}")]
    public async Task<IActionResult> GetNotifications(string recipientId)
    {
        var notifications = await _notificationService.GetNotificationsForUserAsync(recipientId);
        return Ok(notifications);
    }
}

public class AddNotificationRequest
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string SenderId { get; set; }
    public string RecipientId { get; set; }
}
