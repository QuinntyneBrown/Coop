using Coop.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace Coop.Infrastructure.Notifications;

/// <summary>
/// Default <see cref="INoticeSender"/> until an email or text message provider
/// is connected: writes each message to the log and sends nothing outside the system.
/// </summary>
public class LoggingNoticeSender : INoticeSender
{
    private readonly ILogger<LoggingNoticeSender> _logger;

    public LoggingNoticeSender(ILogger<LoggingNoticeSender> logger) => _logger = logger;

    public Task SendEmailAsync(string email, string subject, string body, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Notice email to {Email}: {Subject}", email, subject);
        return Task.CompletedTask;
    }

    public Task SendTextAsync(string phoneNumber, string message, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Notice text message to {PhoneNumber}: {Message}", phoneNumber, message);
        return Task.CompletedTask;
    }
}
