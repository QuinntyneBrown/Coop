using System.Collections.Concurrent;
using Coop.Application.Common.Interfaces;

namespace Coop.Cli.Tests;

/// <summary>
/// Test double for <see cref="INoticeSender"/> that keeps every message instead of sending it.
/// </summary>
public class RecordingNoticeSender : INoticeSender
{
    public ConcurrentQueue<SentEmail> Emails { get; } = new();

    public ConcurrentQueue<SentText> Texts { get; } = new();

    /// <summary>When true, every email fails as it does when the mail server refuses or cannot be reached.</summary>
    public bool FailEmails { get; set; }

    public Task SendEmailAsync(string email, string subject, string body, CancellationToken cancellationToken)
    {
        if (FailEmails)
        {
            throw new InvalidOperationException("The mail server could not be reached.");
        }

        Emails.Enqueue(new SentEmail(email, subject, body));
        return Task.CompletedTask;
    }

    public Task SendTextAsync(string phoneNumber, string message, CancellationToken cancellationToken)
    {
        Texts.Enqueue(new SentText(phoneNumber, message));
        return Task.CompletedTask;
    }
}

public record SentEmail(string Email, string Subject, string Body);

public record SentText(string PhoneNumber, string Message);
