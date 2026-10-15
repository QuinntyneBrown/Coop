using System.Net;
using System.Net.Mail;
using Coop.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace Coop.Infrastructure.Notifications;

/// <summary>
/// Sends each notice email as plain text through the configured SMTP server
/// (ADR 0008). Text messages have no provider yet, so they are only logged.
/// A server that refuses a message or cannot be reached makes the send throw,
/// so the notice stays unsent and the office can send it again (ADR 0007).
/// </summary>
public class SmtpNoticeSender : INoticeSender
{
    private readonly NoticeEmailOptions _options;
    private readonly ILogger<SmtpNoticeSender> _logger;

    public SmtpNoticeSender(NoticeEmailOptions options, ILogger<SmtpNoticeSender> logger)
    {
        _options = options;
        _logger = logger;
    }

    public async Task SendEmailAsync(string email, string subject, string body, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.FromAddress))
        {
            throw new InvalidOperationException("Notices:Email:FromAddress must be set to send notice emails.");
        }

        using var message = new MailMessage
        {
            From = new MailAddress(_options.FromAddress, _options.FromName),
            Subject = subject,
            Body = body,
            IsBodyHtml = false,
        };

        try
        {
            message.To.Add(email);
        }
        catch (FormatException)
        {
            // One member's mistyped address must not stop the notice reaching everyone else.
            _logger.LogWarning("Notice email skipped: {Email} is not a valid email address", email);
            return;
        }

        using var client = CreateClient();
        await client.SendMailAsync(message, cancellationToken);
    }

    public Task SendTextAsync(string phoneNumber, string message, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Notice text message to {PhoneNumber}: {Message}", phoneNumber, message);
        return Task.CompletedTask;
    }

    private SmtpClient CreateClient()
    {
        if (!string.IsNullOrWhiteSpace(_options.PickupDirectory))
        {
            return new SmtpClient
            {
                DeliveryMethod = SmtpDeliveryMethod.SpecifiedPickupDirectory,
                PickupDirectoryLocation = _options.PickupDirectory,
            };
        }

        var client = new SmtpClient(_options.Host, _options.Port) { EnableSsl = true };
        if (!string.IsNullOrWhiteSpace(_options.UserName))
        {
            client.Credentials = new NetworkCredential(_options.UserName, _options.Password);
        }

        return client;
    }
}
