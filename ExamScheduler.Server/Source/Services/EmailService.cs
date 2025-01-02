using System.Net.Mail;
using System.Net;

public class EmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var emailSettings = _configuration.GetSection("EmailSettings");

        var fromAddress = new MailAddress(emailSettings["SenderEmail"], emailSettings["SenderName"]);
        var toAddress = new MailAddress(toEmail, "");

        var smtp = new SmtpClient
        {
            Host = "smtp.office365.com",
            Port = 587, //Recommended port is 587
            EnableSsl = false,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(emailSettings["SenderEmail"], emailSettings["Password"]),
        };
        using (var message = new MailMessage(fromAddress, toAddress)
        {
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        })
        {
            smtp.SendAsync(message, null);
        }

        return Task.CompletedTask;
    }
}