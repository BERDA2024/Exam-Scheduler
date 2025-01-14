using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ExamScheduler.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Asigură-te că doar utilizatorii autentificați pot accesa acest controller
    public class NotificationsController(NotificationService notificationService) : ControllerBase
    {
        private readonly NotificationService _notificationService = notificationService;

        /// <summary>
        /// Obține notificările pentru utilizatorul curent.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Obține ID-ul utilizatorului curent
            if (userId == null)
                return NotFound(new { message = "User not found." });

            var notifications = await _notificationService.GetNotificationsForUserAsync(userId);
            return Ok(notifications);
        }

        /// <summary>
        /// Șterge o notificare specifică pentru utilizatorul curent.
        /// </summary>
        /// <param name="notificationId">ID-ul notificării care trebuie ștearsă.</param>
        [HttpDelete("{notificationId}")]
        public async Task<IActionResult> DeleteNotification(int notificationId)
        {
            var result = await _notificationService.DeleteNotificationAsync(notificationId);

            if (result is NotFoundResult)
                return NotFound(new { message = "Notification not found." });

            return Ok(new { message = "Notification deleted successfully." });
        }
    }
}