// Acceptance Test
// Traces to: L2-REQ-121, L2-REQ-125, L2-REQ-128
// Description: The site content draft through the API: a save writes the
// draft and leaves the published copy alone, the office reads the draft,
// Publish copies it to the published copy and is harmless to repeat, Discard
// drops it, a preview token lets anyone read the draft for an hour and
// nothing else, the seed never writes a draft, and members and anonymous
// callers are refused by the pipeline.

using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Nodes;
using Coop.Application.Common.Interfaces;
using Coop.Domain.Identity;
using Coop.Infrastructure.Persistence;
using Coop.Infrastructure.Persistence.Seeding;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Coop.Api.Tests;

public class SiteContentDraftTests
{
    private static async Task<JsonObject> PublishedAsync(CoopApiFactory factory)
    {
        var json = await factory.CreateAnonymousClient().GetFromJsonAsync<JsonObject>("/api/site-content");
        return json!["siteContent"]!.AsObject();
    }

    private static async Task<JsonObject> DraftAsync(HttpClient client)
        => (await client.GetFromJsonAsync<JsonObject>("/api/site-content?draft=true"))!;

    private static Task<HttpResponseMessage> SaveAsync(HttpClient client, JsonNode siteContent)
        => client.PutAsJsonAsync("/api/site-content", new JsonObject { ["siteContent"] = siteContent.DeepClone() });

    private static async Task<JsonObject> SaveDraftAsync(CoopApiFactory factory, HttpClient admin, string title)
    {
        var content = await PublishedAsync(factory);
        content["home"]!["sections"]![0]!["title"] = title;
        var response = await SaveAsync(admin, content);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return (await response.Content.ReadFromJsonAsync<JsonObject>())!;
    }

    private static string HeroTitle(JsonNode content) => content["home"]!["sections"]![0]!["title"]!.GetValue<string>();

    private static async Task<int> DraftRowsAsync(CoopApiFactory factory)
    {
        using var scope = factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<CoopDbContext>();
        return await context.JsonContents.CountAsync(j => j.Name == "SiteContentDraft");
    }

    [Fact]
    public async Task Given_the_office_saves_then_the_draft_changes_and_visitors_still_see_the_published_copy()
    {
        await using var factory = new CoopApiFactory();
        var admin = await factory.CreateAdminClientAsync();
        var before = HeroTitle(await PublishedAsync(factory));

        var saved = await SaveDraftAsync(factory, admin, "Come home to the co-op.");

        Assert.Equal("Come home to the co-op.", HeroTitle(saved["siteContent"]!));
        Assert.Equal(before, HeroTitle(await PublishedAsync(factory)));
        var draft = await DraftAsync(admin);
        Assert.True(draft["hasDraft"]!.GetValue<bool>());
        Assert.Equal("Come home to the co-op.", HeroTitle(draft["siteContent"]!));
        Assert.Equal(1, await DraftRowsAsync(factory));
    }

    [Fact]
    public async Task Given_no_draft_when_the_office_reads_the_draft_then_it_is_the_published_copy_and_hasDraft_is_false()
    {
        await using var factory = new CoopApiFactory();
        var admin = await factory.CreateAdminClientAsync();

        var draft = await DraftAsync(admin);

        Assert.False(draft["hasDraft"]!.GetValue<bool>());
        Assert.True(JsonNode.DeepEquals(await PublishedAsync(factory), draft["siteContent"]));
        Assert.Equal(0, await DraftRowsAsync(factory));
    }

    [Fact]
    public async Task Given_a_draft_when_the_office_publishes_then_visitors_see_it_and_publishing_again_is_harmless()
    {
        await using var factory = new CoopApiFactory();
        var admin = await factory.CreateAdminClientAsync();
        await SaveDraftAsync(factory, admin, "A home of our own.");

        var first = await admin.PostAsync("/api/site-content/publish", null);
        Assert.Equal(HttpStatusCode.OK, first.StatusCode);
        var body = (await first.Content.ReadFromJsonAsync<JsonObject>())!;
        Assert.False(body["hasDraft"]!.GetValue<bool>());
        Assert.Equal("A home of our own.", HeroTitle(body["siteContent"]!));
        Assert.Equal("A home of our own.", HeroTitle(await PublishedAsync(factory)));
        Assert.Equal(0, await DraftRowsAsync(factory));

        var second = await admin.PostAsync("/api/site-content/publish", null);
        Assert.Equal(HttpStatusCode.OK, second.StatusCode);
        Assert.Equal(await first.Content.ReadAsStringAsync(), await second.Content.ReadAsStringAsync());
        Assert.False((await DraftAsync(admin))["hasDraft"]!.GetValue<bool>());
    }

    [Fact]
    public async Task Given_a_draft_when_the_office_discards_it_then_the_published_copy_stands_and_discarding_again_is_harmless()
    {
        await using var factory = new CoopApiFactory();
        var admin = await factory.CreateAdminClientAsync();
        var before = HeroTitle(await PublishedAsync(factory));
        await SaveDraftAsync(factory, admin, "Never published.");

        var first = await admin.DeleteAsync("/api/site-content/draft");
        Assert.Equal(HttpStatusCode.OK, first.StatusCode);
        var body = (await first.Content.ReadFromJsonAsync<JsonObject>())!;
        Assert.False(body["hasDraft"]!.GetValue<bool>());
        Assert.Equal(before, HeroTitle(body["siteContent"]!));
        Assert.Equal(before, HeroTitle(await PublishedAsync(factory)));
        Assert.Equal(0, await DraftRowsAsync(factory));

        var second = await admin.DeleteAsync("/api/site-content/draft");
        Assert.Equal(HttpStatusCode.OK, second.StatusCode);
        Assert.Equal(before, HeroTitle(await PublishedAsync(factory)));
    }

    [Fact]
    public async Task Given_a_preview_token_then_anyone_can_read_the_draft_for_an_hour_and_nothing_else()
    {
        await using var factory = new CoopApiFactory();
        var admin = await factory.CreateAdminClientAsync();
        await SaveDraftAsync(factory, admin, "Only in the draft.");
        var anonymous = factory.CreateAnonymousClient();

        var issued = await admin.PostAsync("/api/site-content/preview-token", null);
        Assert.Equal(HttpStatusCode.OK, issued.StatusCode);
        var body = (await issued.Content.ReadFromJsonAsync<JsonObject>())!;
        var token = body["token"]!.GetValue<string>();
        var expiresOn = body["expiresOn"]!.GetValue<DateTimeOffset>();
        Assert.InRange(expiresOn - DateTimeOffset.UtcNow, TimeSpan.FromMinutes(59), TimeSpan.FromMinutes(61));

        var preview = await anonymous.GetFromJsonAsync<JsonObject>($"/api/site-content?preview={Uri.EscapeDataString(token)}");
        Assert.Equal("Only in the draft.", HeroTitle(preview!["siteContent"]!));
        Assert.NotEqual("Only in the draft.", HeroTitle(await PublishedAsync(factory)));

        // The token is no bearer token: it opens no office request.
        Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.GetAsync($"/api/site-content?draft=true&preview={Uri.EscapeDataString(token)}")).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.PostAsync($"/api/site-content/publish?preview={Uri.EscapeDataString(token)}", null)).StatusCode);

        // Without a draft the token reads the published copy.
        Assert.Equal(HttpStatusCode.OK, (await admin.DeleteAsync("/api/site-content/draft")).StatusCode);
        preview = await anonymous.GetFromJsonAsync<JsonObject>($"/api/site-content?preview={Uri.EscapeDataString(token)}");
        Assert.True(JsonNode.DeepEquals(await PublishedAsync(factory), preview!["siteContent"]));
    }

    [Theory]
    [InlineData("not-a-token")]
    [InlineData("")]
    public async Task Given_an_unknown_or_altered_token_then_the_preview_read_is_refused(string suffix)
    {
        await using var factory = new CoopApiFactory();
        var admin = await factory.CreateAdminClientAsync();
        var issued = (await (await admin.PostAsync("/api/site-content/preview-token", null)).Content.ReadFromJsonAsync<JsonObject>())!;
        var altered = issued["token"]!.GetValue<string>() + suffix;
        if (suffix.Length == 0) altered = "x" + altered[1..];

        var response = await factory.CreateAnonymousClient().GetAsync($"/api/site-content?preview={Uri.EscapeDataString(altered)}");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Given_an_expired_token_then_the_preview_read_is_refused()
    {
        await using var factory = new CoopApiFactory();
        string expired;
        using (var scope = factory.Services.CreateScope())
        {
            expired = scope.ServiceProvider.GetRequiredService<IPreviewTokenService>().Issue(DateTimeOffset.UtcNow.AddMinutes(-1));
        }

        var response = await factory.CreateAnonymousClient().GetAsync($"/api/site-content?preview={Uri.EscapeDataString(expired)}");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Given_a_fresh_seed_then_no_draft_exists_and_a_re_run_seed_leaves_the_draft_alone()
    {
        await using var factory = new CoopApiFactory();
        var admin = await factory.CreateAdminClientAsync();
        Assert.Equal(0, await DraftRowsAsync(factory));
        await SaveDraftAsync(factory, admin, "Kept through the seed.");

        using (var scope = factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<CoopDbContext>();
            await SeedData.SeedAsync(context, scope.ServiceProvider.GetRequiredService<IPasswordHasher>());
        }

        Assert.Equal(1, await DraftRowsAsync(factory));
        Assert.Equal("Kept through the seed.", HeroTitle((await DraftAsync(admin))["siteContent"]!));
    }

    [Fact]
    public async Task Given_a_member_then_the_draft_publish_discard_and_token_requests_are_refused_and_nothing_changes()
    {
        await using var factory = new CoopApiFactory();
        var admin = await factory.CreateAdminClientAsync();
        await SaveDraftAsync(factory, admin, "Office only.");
        var member = await factory.CreateMemberClientAsync();

        Assert.Equal(HttpStatusCode.Forbidden, (await member.GetAsync("/api/site-content?draft=true")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await member.PostAsync("/api/site-content/publish", null)).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await member.DeleteAsync("/api/site-content/draft")).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await member.PostAsync("/api/site-content/preview-token", null)).StatusCode);

        Assert.Equal(1, await DraftRowsAsync(factory));
        Assert.NotEqual("Office only.", HeroTitle(await PublishedAsync(factory)));
        Assert.Equal("Office only.", HeroTitle((await DraftAsync(admin))["siteContent"]!));
    }

    [Fact]
    public async Task Given_an_anonymous_caller_then_the_draft_publish_discard_and_token_requests_answer_401()
    {
        await using var factory = new CoopApiFactory();
        var anonymous = factory.CreateAnonymousClient();

        Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.GetAsync("/api/site-content?draft=true")).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.PostAsync("/api/site-content/publish", null)).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.DeleteAsync("/api/site-content/draft")).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.PostAsync("/api/site-content/preview-token", null)).StatusCode);
    }

    [Fact]
    public async Task Given_the_staff_then_they_can_publish_and_discard_like_an_administrator()
    {
        await using var factory = new CoopApiFactory();
        var staff = await factory.CreateStaffClientAsync();
        await SaveDraftAsync(factory, staff, "Saved by the staff.");

        Assert.Equal(HttpStatusCode.OK, (await staff.PostAsync("/api/site-content/preview-token", null)).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await staff.PostAsync("/api/site-content/publish", null)).StatusCode);
        Assert.Equal("Saved by the staff.", HeroTitle(await PublishedAsync(factory)));
    }
}
