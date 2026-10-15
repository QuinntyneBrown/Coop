// Acceptance Test
// Traces to: L2-REQ-092, L2-REQ-093 (AC11)
// Description: Members choose on their profile whether new notices reach them
// by email or text message. The office sends a published notice once to the
// members who chose it, at the address on their profile; members who did not
// choose, have no such address or are deleted get nothing. A draft cannot be
// sent, a member cannot send, and sending again sends nothing. When the mail
// server fails, the notice stays unsent and a later send delivers it.

using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text.Json;
using Coop.Domain.Identity;
using Coop.Domain.Profiles;
using Coop.Infrastructure.Persistence;
using Coop.SharedKernel;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Coop.Api.Tests;

public class NoticeDeliveryTests : IClassFixture<CoopApiFactory>
{
    private const string Body = "Join your neighbours in the courtyard on Saturday from 2 to 4 pm.";

    private readonly CoopApiFactory _factory;

    public NoticeDeliveryTests(CoopApiFactory factory) => _factory = factory;

    /// <summary>Seeds a fictional member with a profile and signs in as them.</summary>
    private async Task<HttpClient> CreateMemberAsync(string username, string? email = null, string? phone = null)
    {
        const string password = "Member123!";
        using (var scope = _factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<CoopDbContext>();
            var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
            var salt = RandomNumberGenerator.GetBytes(16);
            var user = new User { Username = username, Salt = salt, Password = hasher.HashPassword(salt, password) };
            user.Roles.Add(await context.Roles.SingleAsync(r => r.Name == Constants.Roles.Member));
            context.Users.Add(user);
            context.Members.Add(new Member { UserId = user.UserId, Firstname = username, Lastname = "Fictional", Email = email, PhoneNumber = phone });
            await context.SaveChangesAsync();
        }
        return await _factory.CreateClientAsAsync(username, password);
    }

    private static string Unique(string name) => $"{name}-{Guid.NewGuid():N}";

    private static async Task ChooseAsync(HttpClient member, bool byEmail, bool byText)
    {
        var response = await member.PutAsJsonAsync("/api/user/profile", new { noticeByEmail = byEmail, noticeByText = byText });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    private static async Task<string> CreateNoticeAsync(HttpClient admin, string name, bool publish = true)
    {
        var response = await admin.PostAsJsonAsync("/api/notice", new { name, body = Body });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var id = (await response.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("notice").GetProperty("documentId").GetString()!;
        if (publish)
        {
            Assert.Equal(HttpStatusCode.OK, (await admin.PutAsJsonAsync("/api/document/publish", new { documentId = id })).StatusCode);
        }
        return id;
    }

    private static Task<HttpResponseMessage> SendAsync(HttpClient client, string documentId)
        => client.PostAsync($"/api/notice/{documentId}/send", null);

    private static async Task<JsonElement> SendOkAsync(HttpClient client, string documentId)
    {
        var response = await SendAsync(client, documentId);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return (await response.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("notice");
    }

    [Fact]
    public async Task Given_a_member_who_has_not_chosen_when_they_read_their_profile_then_no_notices_are_chosen()
    {
        var member = await CreateMemberAsync(Unique("ada"), "ada@example.invalid", "555-0110");

        var profile = await member.GetFromJsonAsync<JsonElement>("/api/user/profile");

        Assert.False(profile.GetProperty("noticeByEmail").GetBoolean());
        Assert.False(profile.GetProperty("noticeByText").GetBoolean());
    }

    [Fact]
    public async Task Given_a_member_when_they_save_their_notice_choice_then_it_is_kept_and_left_alone_by_other_edits()
    {
        var member = await CreateMemberAsync(Unique("bea"), "bea@example.invalid", "555-0111");

        await ChooseAsync(member, byEmail: true, byText: false);
        var edit = await member.PutAsJsonAsync("/api/user/profile", new { firstName = "Beatrix" });
        Assert.Equal(HttpStatusCode.OK, edit.StatusCode);

        var profile = await member.GetFromJsonAsync<JsonElement>("/api/user/profile");
        Assert.True(profile.GetProperty("noticeByEmail").GetBoolean());
        Assert.False(profile.GetProperty("noticeByText").GetBoolean());
        Assert.Equal("Beatrix", profile.GetProperty("firstName").GetString());
    }

    [Fact]
    public async Task Given_members_who_chose_email_and_text_when_the_office_sends_a_published_notice_then_each_address_gets_one_message()
    {
        var both = $"{Unique("cleo")}@example.invalid";
        var bothPhone = $"555-{RandomNumberGenerator.GetInt32(1000, 9999)}";
        var none = $"{Unique("dot")}@example.invalid";
        var nonePhone = $"555-{RandomNumberGenerator.GetInt32(1000, 9999)}";
        var gone = $"{Unique("eve")}@example.invalid";

        await ChooseAsync(await CreateMemberAsync(Unique("cleo"), both, bothPhone), byEmail: true, byText: true);
        await ChooseAsync(await CreateMemberAsync(Unique("cleo-again"), both), byEmail: true, byText: false);
        await CreateMemberAsync(Unique("dot"), none, nonePhone);
        await ChooseAsync(await CreateMemberAsync(Unique("fay")), byEmail: true, byText: true);
        var eve = await CreateMemberAsync(Unique("eve"), gone);
        await ChooseAsync(eve, byEmail: true, byText: false);
        using (var scope = _factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<CoopDbContext>();
            (await context.Members.SingleAsync(m => m.Email == gone)).IsDeleted = true;
            await context.SaveChangesAsync();
        }

        var admin = await _factory.CreateAdminClientAsync();
        var name = Unique("Courtyard gathering");
        var id = await CreateNoticeAsync(admin, name);

        var notice = await SendOkAsync(admin, id);

        Assert.NotEqual(JsonValueKind.Null, notice.GetProperty("sentOn").ValueKind);
        var emails = _factory.Notices.Emails.Where(e => e.Subject == $"New notice: {name}").ToArray();
        var texts = _factory.Notices.Texts.Where(t => t.Message.Contains(name)).ToArray();
        Assert.Single(emails, e => e.Email == both);
        Assert.Equal(Body, emails.Single(e => e.Email == both).Body);
        Assert.Single(texts, t => t.PhoneNumber == bothPhone);
        Assert.Equal($"New notice from the co-op: {name}. {Body}", texts.Single(t => t.PhoneNumber == bothPhone).Message);
        Assert.DoesNotContain(emails, e => e.Email == none || e.Email == gone || string.IsNullOrWhiteSpace(e.Email));
        Assert.DoesNotContain(texts, t => t.PhoneNumber == nonePhone || string.IsNullOrWhiteSpace(t.PhoneNumber));
    }

    [Fact]
    public async Task Given_a_sent_notice_when_it_is_sent_again_then_nothing_more_is_sent()
    {
        var email = $"{Unique("gus")}@example.invalid";
        await ChooseAsync(await CreateMemberAsync(Unique("gus"), email), byEmail: true, byText: false);
        var admin = await _factory.CreateAdminClientAsync();
        var id = await CreateNoticeAsync(admin, Unique("Water shut off"));

        var first = await SendOkAsync(admin, id);
        var again = await SendOkAsync(admin, id);

        Assert.Equal(first.GetProperty("sentOn").GetDateTime(), again.GetProperty("sentOn").GetDateTime());
        Assert.Single(_factory.Notices.Emails, e => e.Email == email);
    }

    [Fact]
    public async Task Given_a_draft_or_missing_notice_when_the_office_sends_it_then_it_is_rejected()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var draft = await CreateNoticeAsync(admin, Unique("Draft notice"), publish: false);

        foreach (var id in new[] { draft, Guid.NewGuid().ToString() })
        {
            var response = await SendAsync(admin, id);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var json = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.Contains(json.GetProperty("errors").EnumerateArray(),
                e => e.GetProperty("message").GetString() == "Only a published notice can be sent.");
        }
    }

    [Fact]
    public async Task Given_a_member_when_they_send_a_notice_then_the_api_refuses_and_nothing_is_sent()
    {
        var email = $"{Unique("hal")}@example.invalid";
        await ChooseAsync(await CreateMemberAsync(Unique("hal"), email), byEmail: true, byText: false);
        var admin = await _factory.CreateAdminClientAsync();
        var id = await CreateNoticeAsync(admin, Unique("Members only"));
        var member = await _factory.CreateMemberClientAsync();

        Assert.Equal(HttpStatusCode.Forbidden, (await SendAsync(member, id)).StatusCode);

        Assert.DoesNotContain(_factory.Notices.Emails, e => e.Email == email);
    }

    [Fact]
    public async Task Given_the_mail_server_fails_when_the_office_sends_a_notice_then_it_stays_unsent_and_a_later_send_delivers_it()
    {
        var email = $"{Unique("ida")}@example.invalid";
        await ChooseAsync(await CreateMemberAsync(Unique("ida"), email), byEmail: true, byText: false);
        var admin = await _factory.CreateAdminClientAsync();
        var id = await CreateNoticeAsync(admin, Unique("Elevator out of service"));

        _factory.Notices.FailEmails = true;
        try
        {
            var failure = await Record.ExceptionAsync(async () =>
            {
                var response = await SendAsync(admin, id);
                Assert.True((int)response.StatusCode >= 500, $"Expected an error status but got {(int)response.StatusCode}.");
            });
            Assert.Null(failure);
        }
        finally
        {
            _factory.Notices.FailEmails = false;
        }

        var unsent = await admin.GetFromJsonAsync<JsonElement>($"/api/notice/{id}");
        Assert.Equal(JsonValueKind.Null, unsent.GetProperty("notice").GetProperty("sentOn").ValueKind);
        Assert.DoesNotContain(_factory.Notices.Emails, e => e.Email == email);

        var sent = await SendOkAsync(admin, id);

        Assert.NotEqual(JsonValueKind.Null, sent.GetProperty("sentOn").ValueKind);
        Assert.Single(_factory.Notices.Emails, e => e.Email == email);
        var again = await SendOkAsync(admin, id);
        Assert.Equal(sent.GetProperty("sentOn").GetDateTime(), again.GetProperty("sentOn").GetDateTime());
        Assert.Single(_factory.Notices.Emails, e => e.Email == email);
    }
}
