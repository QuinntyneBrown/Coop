namespace Coop.Infrastructure.Notifications;

/// <summary>
/// The <c>Notices:Email</c> settings: the SMTP server that sends notice emails
/// and the sender members see (ADR 0008). The user name and password come from
/// user secrets or environment variables, never <c>appsettings.json</c>.
/// </summary>
public class NoticeEmailOptions
{
    public const string SectionName = "Notices:Email";

    /// <summary>SMTP server. Empty means notice emails are only logged.</summary>
    public string? Host { get; set; }

    public int Port { get; set; } = 587;

    public string? UserName { get; set; }

    public string? Password { get; set; }

    public string? FromAddress { get; set; }

    public string? FromName { get; set; }

    /// <summary>Development and tests only: write each email as an .eml file here instead of using the network.</summary>
    public string? PickupDirectory { get; set; }

    /// <summary>True when emails should be sent rather than only logged.</summary>
    public bool IsConfigured => !string.IsNullOrWhiteSpace(Host) || !string.IsNullOrWhiteSpace(PickupDirectory);
}
