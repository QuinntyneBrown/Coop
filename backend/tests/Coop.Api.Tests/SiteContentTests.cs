// Acceptance Test
// Traces to: L2-REQ-094, L2-REQ-097, L2-REQ-098, L2-REQ-099, L2-REQ-100
// Description: The site content through the API: the seeded content read
// anonymously, whole-content replacement saved to the draft and published
// into the SiteContent JSON content entry, idempotent re-sending, the field
// rules (required values, safe links and photo addresses, photo
// descriptions, lengths), refusal of members and anonymous callers, and a
// re-run seed keeping saved content. The draft itself is covered by
// SiteContentDraftTests.

using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Nodes;
using Coop.Domain.Identity;
using Coop.Infrastructure.Persistence;
using Coop.Infrastructure.Persistence.Seeding;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Coop.Api.Tests;

public class SiteContentTests : IClassFixture<CoopApiFactory>
{
    private readonly CoopApiFactory _factory;

    public SiteContentTests(CoopApiFactory factory) => _factory = factory;

    private static async Task<JsonObject> GetContentAsync(HttpClient client)
    {
        var json = await client.GetFromJsonAsync<JsonObject>("/api/site-content");
        return json!["siteContent"]!.AsObject();
    }

    private static Task<HttpResponseMessage> SaveContentAsync(HttpClient client, JsonNode siteContent)
        => client.PutAsJsonAsync("/api/site-content", new JsonObject { ["siteContent"] = siteContent.DeepClone() });

    /// <summary>Saves to the draft and publishes it, so visitors see the content (L2-REQ-121).</summary>
    private static async Task<HttpResponseMessage> SaveAndPublishAsync(HttpClient client, JsonNode siteContent)
    {
        var saved = await SaveContentAsync(client, siteContent);
        if (!saved.IsSuccessStatusCode)
            return saved;
        var published = await client.PostAsync("/api/site-content/publish", null);
        Assert.Equal(HttpStatusCode.OK, published.StatusCode);
        return saved;
    }

    private static JsonNode At(JsonNode node, string path)
    {
        foreach (var part in path.Split('.'))
            node = int.TryParse(part, out var index) ? node[index]! : node[part]!;
        return node;
    }

    private static void Set(JsonNode root, string path, JsonNode? value)
    {
        var parent = path.Contains('.') ? At(root, path[..path.LastIndexOf('.')]) : root;
        var key = path[(path.LastIndexOf('.') + 1)..];
        if (int.TryParse(key, out var index)) parent[index] = value;
        else parent[key] = value;
    }

    private static IEnumerable<JsonObject> PhotosIn(JsonNode? node)
    {
        switch (node)
        {
            case JsonObject obj when obj.ContainsKey("src") && obj.ContainsKey("alt"):
                yield return obj;
                break;
            case JsonObject obj:
                foreach (var (_, child) in obj)
                    foreach (var photo in PhotosIn(child)) yield return photo;
                break;
            case JsonArray array:
                foreach (var child in array)
                    foreach (var photo in PhotosIn(child)) yield return photo;
                break;
        }
    }

    [Fact]
    public async Task Given_a_fresh_database_then_visitors_can_read_every_seeded_value_without_signing_in()
    {
        // Other tests in this class change the shared database, so this one seeds its own.
        await using var fresh = new CoopApiFactory();
        var content = await GetContentAsync(fresh.CreateAnonymousClient());

        Assert.Equal("OWN Housing Co-op", At(content, "header.siteName").GetValue<string>());
        Assert.Equal("Member sign in", At(content, "header.signInLink.label").GetValue<string>());
        Assert.Equal("/login", At(content, "header.signInLink.href").GetValue<string>());
        Assert.Equal("Visit or write", At(content, "footer.contactHeading").GetValue<string>());
        Assert.Equal("A home of our own, in the heart of Toronto.", At(content, "home.hero.title").GetValue<string>());
        Assert.Equal("/own/hero.svg", At(content, "home.hero.photo.src").GetValue<string>());
        Assert.Equal(6, At(content, "home.gallery.photos").AsArray().Count);
        Assert.Equal(2, At(content, "home.features.rows").AsArray().Count);

        var photos = PhotosIn(content).ToList();
        Assert.Equal(10, photos.Count);
        Assert.All(photos, photo =>
        {
            Assert.False(string.IsNullOrWhiteSpace(photo["alt"]!.GetValue<string>()));
            Assert.True(photo["width"]!.GetValue<int>() > 0);
            Assert.True(photo["height"]!.GetValue<int>() > 0);
        });
    }

    [Fact]
    public async Task Given_an_admin_changes_the_hero_photo_and_title_then_visitors_see_them_in_the_site_content_entry()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var content = await GetContentAsync(admin);
        Set(content, "home.hero.title", "Come home to the co-op.");
        Set(content, "home.hero.photo", new JsonObject
        {
            ["src"] = "http://localhost:5000/api/digitalasset/serve/5f0c",
            ["alt"] = "Neighbours planting tomatoes in the rooftop garden.",
            ["width"] = 1600,
            ["height"] = 1200,
        });
        Set(content, "header.menuLinks", new JsonArray(new JsonObject { ["label"] = "Our garden", ["href"] = "/pages/our-garden" }));

        var response = await SaveAndPublishAsync(admin, content);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var anonymous = _factory.CreateAnonymousClient();
        var published = await GetContentAsync(anonymous);
        Assert.Equal("Come home to the co-op.", At(published, "home.hero.title").GetValue<string>());
        Assert.Equal("http://localhost:5000/api/digitalasset/serve/5f0c", At(published, "home.hero.photo.src").GetValue<string>());
        Assert.Equal("Neighbours planting tomatoes in the rooftop garden.", At(published, "home.hero.photo.alt").GetValue<string>());
        Assert.Equal(1600, At(published, "home.hero.photo.width").GetValue<int>());
        Assert.Equal("Our garden", At(published, "header.menuLinks.0.label").GetValue<string>());
        Assert.Single(At(published, "header.menuLinks").AsArray());

        var entry = await anonymous.GetFromJsonAsync<JsonElement>("/api/jsoncontent/name/SiteContent");
        var stored = JsonNode.Parse(entry.GetProperty("jsonContent").GetProperty("json").GetString()!)!;
        Assert.Equal("Come home to the co-op.", At(stored, "home.hero.title").GetValue<string>());
    }

    [Fact]
    public async Task Given_the_same_content_is_sent_twice_then_the_content_is_the_same()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var content = await GetContentAsync(admin);
        Set(content, "footer.copyright", "© 2026 OWN Housing Co-operative Inc.");

        var first = await SaveAndPublishAsync(admin, content);
        var second = await SaveAndPublishAsync(admin, content);
        Assert.Equal(HttpStatusCode.OK, first.StatusCode);
        Assert.Equal(HttpStatusCode.OK, second.StatusCode);

        var firstBody = await first.Content.ReadAsStringAsync();
        var secondBody = await second.Content.ReadAsStringAsync();
        Assert.Equal(firstBody, secondBody);
        var published = await GetContentAsync(_factory.CreateAnonymousClient());
        Assert.Equal("© 2026 OWN Housing Co-operative Inc.", At(published, "footer.copyright").GetValue<string>());
    }

    [Fact]
    public async Task Given_the_entry_is_missing_when_the_admin_saves_then_the_entry_is_created()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var content = await GetContentAsync(admin);
        using (var scope = _factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<CoopDbContext>();
            context.JsonContents.RemoveRange(context.JsonContents.Where(j => j.Name == "SiteContent"));
            await context.SaveChangesAsync();
        }
        Assert.Equal(HttpStatusCode.NotFound, (await admin.GetAsync("/api/site-content")).StatusCode);

        var response = await SaveAndPublishAsync(admin, content);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var published = await GetContentAsync(_factory.CreateAnonymousClient());
        Assert.Equal("OWN Housing Co-op", At(published, "header.siteName").GetValue<string>());
    }

    [Fact]
    public async Task Given_saved_content_when_the_seed_runs_again_then_the_saved_content_is_kept()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var content = await GetContentAsync(admin);
        Set(content, "header.siteSubtitle", "A home for older women since 1997");
        Assert.Equal(HttpStatusCode.OK, (await SaveAndPublishAsync(admin, content)).StatusCode);

        using (var scope = _factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<CoopDbContext>();
            await SeedData.SeedAsync(context, scope.ServiceProvider.GetRequiredService<IPasswordHasher>());
            Assert.Equal(1, await context.JsonContents.CountAsync(j => j.Name == "SiteContent"));
        }

        var published = await GetContentAsync(_factory.CreateAnonymousClient());
        Assert.Equal("A home for older women since 1997", At(published, "header.siteSubtitle").GetValue<string>());
    }

    [Fact]
    public async Task Given_a_member_when_they_save_the_site_content_then_the_api_refuses_and_nothing_changes()
    {
        var member = await _factory.CreateMemberClientAsync();
        var content = await GetContentAsync(member);
        var siteName = At(content, "header.siteName").GetValue<string>();
        Set(content, "header.siteName", "Changed by a member");

        var response = await SaveContentAsync(member, content);
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);

        var published = await GetContentAsync(_factory.CreateAnonymousClient());
        Assert.Equal(siteName, At(published, "header.siteName").GetValue<string>());
    }

    [Fact]
    public async Task Given_an_anonymous_visitor_when_they_save_the_site_content_then_the_api_answers_401()
    {
        var anonymous = _factory.CreateAnonymousClient();
        var content = await GetContentAsync(anonymous);
        var response = await SaveContentAsync(anonymous, content);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Theory]
    [InlineData("header.menuLinks.0.href", "/pages/our-garden")]
    [InlineData("header.menuLinks.0.href", "/#visit")]
    [InlineData("header.menuLinks.0.href", "https://example.test/garden")]
    [InlineData("header.menuLinks.0.href", "http://example.test/garden")]
    [InlineData("header.menuLinks.0.href", "mailto:office@example.invalid")]
    [InlineData("header.menuLinks.0.href", "tel:+14165550142")]
    [InlineData("home.hero.photo.src", "/own/garden.svg")]
    [InlineData("home.hero.photo.src", "https://example.test/garden.jpg")]
    [InlineData("home.hero.lead", "")]
    public async Task Given_a_safe_value_then_the_save_is_accepted(string path, string value)
    {
        var admin = await _factory.CreateAdminClientAsync();
        var content = await GetContentAsync(admin);
        Set(content, path, value);

        var response = await SaveAndPublishAsync(admin, content);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var published = await GetContentAsync(_factory.CreateAnonymousClient());
        Assert.Equal(value, At(published, path).GetValue<string>());
    }

    [Theory]
    [InlineData("header.siteName", "")]
    [InlineData("header.siteName", "   ")]
    [InlineData("home.hero.title", "")]
    [InlineData("home.about.title", "")]
    [InlineData("home.features.rows.0.title", "")]
    [InlineData("home.quote.text", "")]
    [InlineData("home.glance.figures.0.value", "")]
    [InlineData("home.glance.figures.0.label", "")]
    [InlineData("home.about.values.0.title", "")]
    [InlineData("header.menuLinks.0.label", "")]
    [InlineData("header.menuLinks.0.label", "long-label")]
    [InlineData("header.menuLinks.0.href", "")]
    [InlineData("header.menuLinks.0.href", "javascript:alert(1)")]
    [InlineData("header.menuLinks.0.href", "JavaScript:alert(1)")]
    [InlineData("header.menuLinks.0.href", "data:text/html,hello")]
    [InlineData("header.menuLinks.0.href", "//example.test/garden")]
    [InlineData("header.menuLinks.0.href", "garden")]
    [InlineData("header.menuLinks.0.href", "long-href")]
    [InlineData("footer.memberLinks.0.href", "javascript:alert(1)")]
    [InlineData("home.hero.primaryAction.href", "javascript:alert(1)")]
    [InlineData("home.hero.photo.alt", "")]
    [InlineData("home.hero.photo.alt", "long-alt")]
    [InlineData("home.hero.photo.src", "")]
    [InlineData("home.hero.photo.src", "javascript:alert(1)")]
    [InlineData("home.hero.photo.src", "data:image/png;base64,AAAA")]
    [InlineData("home.gallery.photos.0.photo.alt", "")]
    [InlineData("home.quote.photo.alt", "")]
    [InlineData("home.hero.lead", "long-text")]
    [InlineData("home.about.values.0.icon", "rocket")]
    [InlineData("home.gallery.photos.0.size", "huge")]
    public async Task Given_content_that_breaks_a_rule_then_the_save_is_rejected_and_nothing_changes(string path, string value)
    {
        var admin = await _factory.CreateAdminClientAsync();
        var content = await GetContentAsync(admin);
        var before = At(content, path).GetValue<string>();

        value = value switch
        {
            "long-label" => new string('a', 101),
            "long-href" => "https://example.test/" + new string('a', 2048),
            "long-alt" => new string('a', 251),
            "long-text" => new string('a', 2001),
            _ => value,
        };
        Set(content, path, value);

        var response = await SaveContentAsync(admin, content);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var published = await GetContentAsync(_factory.CreateAnonymousClient());
        Assert.Equal(before, At(published, path).GetValue<string>());
    }

    [Theory]
    [InlineData(0)]
    [InlineData(10001)]
    public async Task Given_a_photo_with_a_size_out_of_range_then_the_save_is_rejected(int width)
    {
        var admin = await _factory.CreateAdminClientAsync();
        var content = await GetContentAsync(admin);
        Set(content, "home.quote.photo.width", width);

        var response = await SaveContentAsync(admin, content);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Given_a_missing_block_then_the_save_is_rejected()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var content = await GetContentAsync(admin);
        content["home"]!.AsObject().Remove("hero");

        var response = await SaveContentAsync(admin, content);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
