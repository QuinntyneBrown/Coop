// Acceptance Test
// Traces to: L2-REQ-093 AC9, AC10
// Description: With an SMTP server configured, a notice goes out as one email
// per chosen address from the configured sender; text messages are only
// logged. With none configured, every message is only written to the log and
// the notice still counts as sent. The tests point the sender at a pickup
// folder, so nothing uses the network.

using System.Collections.Concurrent;
using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text.Json;
using Coop.Domain.Identity;
using Coop.Domain.Profiles;
using Coop.Infrastructure.Notifications;
using Coop.Infrastructure.Persistence;
using Coop.SharedKernel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Coop.Api.Tests;

/// <summary>Runs the API with its real notice sender, writing emails to a temporary pickup folder.</summary>
public class SmtpNoticeApiFactory : CoopApiFactory
{
    public string PickupDirectory { get; } = Path.Combine(Path.GetTempPath(), $"coop-eml-{Guid.NewGuid():N}");

    protected override bool RecordNotices => false;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        Directory.CreateDirectory(PickupDirectory);
        builder.UseSetting("Notices:Email:PickupDirectory", PickupDirectory);
        builder.UseSetting("Notices:Email:FromAddress", "office@ownhousing.example");
        builder.UseSetting("Notices:Email:FromName", "OWN Housing Co-op");
        base.ConfigureWebHost(builder);
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing && Directory.Exists(PickupDirectory))
        {
            Directory.Delete(PickupDirectory, recursive: true);
        }
    }
}

/// <summary>Runs the API with its real notice sender and no email settings, keeping what it logs.</summary>
public class LoggingNoticeApiFactory : CoopApiFactory
{
    public ConcurrentQueue<string> Logged { get; } = new();

    protected override bool RecordNotices => false;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Serilog replaces the logger factory, so capture the sender's own logger.
        builder.ConfigureServices(services =>
            services.AddSingleton<ILogger<LoggingNoticeSender>>(new CapturingLogger<LoggingNoticeSender>(Logged)));
        base.ConfigureWebHost(builder);
    }

    private sealed class CapturingLogger<T>(ConcurrentQueue<string> sink) : ILogger<T>
    {
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
            => sink.Enqueue(formatter(state, exception));
    }
}

public class NoticeEmailTests : IClassFixture<SmtpNoticeApiFactory>, IClassFixture<LoggingNoticeApiFactory>
{
    private const string Body = "Join your neighbours in the courtyard on Saturday from 2 to 4 pm.";

    private readonly SmtpNoticeApiFactory _smtp;
    private readonly LoggingNoticeApiFactory _logging;

    public NoticeEmailTests(SmtpNoticeApiFactory smtp, LoggingNoticeApiFactory logging)
    {
        _smtp = smtp;
        _logging = logging;
    }

    private static string Unique(string name) => $"{name}-{Guid.NewGuid():N}";

    /// <summary>Seeds a fictional member who chose email and text, so a send reaches them.</summary>
    private static async Task SeedMemberAsync(CoopApiFactory factory, string username, string email, string phone)
    {
        using var scope = factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<CoopDbContext>();
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
        var salt = RandomNumberGenerator.GetBytes(16);
        var user = new User { Username = username, Salt = salt, Password = hasher.HashPassword(salt, "Member123!") };
        user.Roles.Add(await context.Roles.SingleAsync(r => r.Name == Constants.Roles.Member));
        context.Users.Add(user);
        context.Members.Add(new Member
        {
            UserId = user.UserId,
            Firstname = username,
            Lastname = "Fictional",
            Email = email,
            PhoneNumber = phone,
            NoticeByEmail = true,
            NoticeByText = true,
        });
        await context.SaveChangesAsync();
    }

    private static async Task<JsonElement> PublishAndSendAsync(CoopApiFactory factory, string name)
    {
        var admin = await factory.CreateAdminClientAsync();
        var created = await admin.PostAsJsonAsync("/api/notice", new { name, body = Body });
        Assert.Equal(HttpStatusCode.OK, created.StatusCode);
        var id = (await created.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("notice").GetProperty("documentId").GetString()!;
        Assert.Equal(HttpStatusCode.OK, (await admin.PutAsJsonAsync("/api/document/publish", new { documentId = id })).StatusCode);

        var sent = await admin.PostAsync($"/api/notice/{id}/send", null);
        Assert.Equal(HttpStatusCode.OK, sent.StatusCode);
        return (await sent.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("notice");
    }

    [Fact]
    public async Task Given_an_smtp_server_is_configured_when_the_office_sends_a_notice_then_the_member_gets_one_email_from_the_co_op()
    {
        var email = $"{Unique("ivy")}@example.invalid";
        await SeedMemberAsync(_smtp, Unique("ivy"), email, "555-0120");
        var name = Unique("Courtyard gathering");

        var notice = await PublishAndSendAsync(_smtp, name);

        Assert.NotEqual(JsonValueKind.Null, notice.GetProperty("sentOn").ValueKind);
        var message = Assert.Single(
            Directory.GetFiles(_smtp.PickupDirectory, "*.eml").Select(File.ReadAllText),
            m => m.Contains($"To: {email}", StringComparison.OrdinalIgnoreCase));
        Assert.Contains("office@ownhousing.example", message);
        Assert.Contains("OWN Housing Co-op", message);
        Assert.Contains($"Subject: New notice: {name}", message);
        Assert.Contains(Body, message);
    }

    [Fact]
    public async Task Given_no_smtp_server_is_configured_when_the_office_sends_a_notice_then_it_is_logged_and_marked_sent()
    {
        var email = $"{Unique("jo")}@example.invalid";
        await SeedMemberAsync(_logging, Unique("jo"), email, "555-0121");
        var name = Unique("Water shut off");

        var notice = await PublishAndSendAsync(_logging, name);

        Assert.NotEqual(JsonValueKind.Null, notice.GetProperty("sentOn").ValueKind);
        Assert.Contains(_logging.Logged, line => line.Contains(email) && line.Contains($"New notice: {name}"));
    }
}
