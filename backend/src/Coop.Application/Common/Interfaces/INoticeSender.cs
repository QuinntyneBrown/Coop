namespace Coop.Application.Common.Interfaces;

/// <summary>
/// Sends a notice to one member by email or text message (L2-REQ-093).
/// </summary>
public interface INoticeSender
{
    Task SendEmailAsync(string email, string subject, string body, CancellationToken cancellationToken);

    Task SendTextAsync(string phoneNumber, string message, CancellationToken cancellationToken);
}
