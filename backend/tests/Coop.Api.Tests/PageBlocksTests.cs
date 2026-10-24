// Acceptance Test
// Traces to: L2-REQ-123, L2-REQ-125
// Description: Website pages through the API with a Published flag and body
// blocks: blocks saved and read in order by kind, each kind validated, a
// body without blocks kept as one Existing content block, only published
// pages for visitors and members while the office and a preview token see
// every page, and a page written before blocks existed rewritten once by
// the seed.

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

public class PageBlocksTests : IClassFixture<CoopApiFactory>
{
    private readonly CoopApiFactory _factory;

    public PageBlocksTests(CoopApiFactory factory) => _factory = factory;

    private static readonly JsonArray Blocks = new()
    {
        new JsonObject { ["kind"] = "heading", ["text"] = "Who can apply" },
        new JsonObject { ["kind"] = "bullets", ["items"] = new JsonArray("Women aged 55 or over.", "A willingness to take part.") },
        new JsonObject { ["kind"] = "paragraph", ["text"] = "Send the form to the office." },
        new JsonObject { ["kind"] = "photo", ["photo"] = new JsonObject { ["src"] = "/own/garden.svg", ["alt"] = "The rooftop garden.", ["width"] = 800, ["height"] = 600 } },
        new JsonObject { ["kind"] = "link", ["label"] = "Send us a note", ["href"] = "/#contact" },
        new JsonObject { ["kind"] = "html", ["html"] = "<p>As it was written before.</p>" },
    };

    private static async Task<JsonObject> CreateAsync(HttpClient admin, string title, JsonNode? sections, bool published = true, string? body = null)
    {
        var request = new JsonObject { ["title"] = title, ["published"] = published };
        if (sections is not null) request["sections"] = sections.DeepClone();
        if (body is not null) request["body"] = body;
        var response = await admin.PostAsJsonAsync("/api/pages", request);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return (await response.Content.ReadFromJsonAsync<JsonObject>())!["page"]!.AsObject();
    }

    private static async Task<string[]> SlugsAsync(HttpClient client, string query = "")
    {
        var json = await client.GetFromJsonAsync<JsonObject>($"/api/pages{query}");
        return json!["pages"]!.AsArray().Select(p => p!["slug"]!.GetValue<string>()).ToArray();
    }

    [Fact]
    public async Task Given_blocks_of_every_kind_then_they_are_saved_and_read_in_order_with_their_values()
    {
        var admin = await _factory.CreateAdminClientAsync();

        var created = await CreateAsync(admin, "Blocks of every kind", Blocks);

        Assert.True(created["published"]!.GetValue<bool>());
        var read = (await _factory.CreateAnonymousClient().GetFromJsonAsync<JsonObject>("/api/pages/blocks-of-every-kind"))!["page"]!;
        var sections = read["sections"]!.AsArray();
        Assert.Equal(new[] { "heading", "bullets", "paragraph", "photo", "link", "html" }, sections.Select(s => s!["kind"]!.GetValue<string>()));
        Assert.Equal("Who can apply", sections[0]!["text"]!.GetValue<string>());
        Assert.Equal(2, sections[1]!["items"]!.AsArray().Count);
        Assert.Equal("The rooftop garden.", sections[3]!["photo"]!["alt"]!.GetValue<string>());
        Assert.Equal(800, sections[3]!["photo"]!["width"]!.GetValue<int>());
        Assert.Equal("/#contact", sections[4]!["href"]!.GetValue<string>());
        Assert.Equal("<p>As it was written before.</p>", sections[5]!["html"]!.GetValue<string>());
    }

    public static TheoryData<string, JsonNode> InvalidBlocks => new()
    {
        { "unknown kind", new JsonObject { ["kind"] = "table", ["text"] = "Rows" } },
        { "empty heading", new JsonObject { ["kind"] = "heading", ["text"] = " " } },
        { "empty paragraph", new JsonObject { ["kind"] = "paragraph", ["text"] = "" } },
        { "empty bullets", new JsonObject { ["kind"] = "bullets", ["items"] = new JsonArray() } },
        { "photo without description", new JsonObject { ["kind"] = "photo", ["photo"] = new JsonObject { ["src"] = "/own/garden.svg", ["alt"] = "", ["width"] = 800, ["height"] = 600 } } },
        { "photo with an unsafe address", new JsonObject { ["kind"] = "photo", ["photo"] = new JsonObject { ["src"] = "javascript:alert(1)", ["alt"] = "A photo", ["width"] = 800, ["height"] = 600 } } },
        { "link with an unsafe address", new JsonObject { ["kind"] = "link", ["label"] = "Go", ["href"] = "javascript:alert(1)" } },
        { "long heading", new JsonObject { ["kind"] = "heading", ["text"] = new string('a', 2001) } },
    };

    [Theory]
    [MemberData(nameof(InvalidBlocks))]
    public async Task Given_an_invalid_block_then_the_page_is_rejected(string reason, JsonNode block)
    {
        var admin = await _factory.CreateAdminClientAsync();

        var response = await admin.PostAsJsonAsync("/api/pages", new JsonObject
        {
            ["title"] = $"Rejected {reason}",
            ["published"] = true,
            ["sections"] = new JsonArray(block.DeepClone()),
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.DoesNotContain(await SlugsAsync(admin), slug => slug.StartsWith("rejected-"));
    }

    [Fact]
    public async Task Given_a_body_and_no_blocks_then_the_body_becomes_one_existing_content_block_and_a_page_may_have_none()
    {
        var admin = await _factory.CreateAdminClientAsync();

        var fromBody = await CreateAsync(admin, "Written before", null, body: "<h2>Our story</h2><p>In 1997.</p>");
        var sections = fromBody["sections"]!.AsArray();
        Assert.Single(sections);
        Assert.Equal("html", sections[0]!["kind"]!.GetValue<string>());
        Assert.Equal("<h2>Our story</h2><p>In 1997.</p>", sections[0]!["html"]!.GetValue<string>());

        var empty = await CreateAsync(admin, "Nothing yet", new JsonArray());
        Assert.Empty(empty["sections"]!.AsArray());

        var updated = await admin.PutAsJsonAsync("/api/pages", new JsonObject
        {
            ["pageId"] = fromBody["pageId"]!.DeepClone(),
            ["title"] = "Written before",
            ["published"] = true,
            ["body"] = "<p>Rewritten.</p>",
        });
        Assert.Equal(HttpStatusCode.OK, updated.StatusCode);
        var page = (await updated.Content.ReadFromJsonAsync<JsonObject>())!["page"]!;
        Assert.Equal("<p>Rewritten.</p>", page["sections"]![0]!["html"]!.GetValue<string>());
    }

    [Fact]
    public async Task Given_an_unpublished_page_then_visitors_and_members_do_not_see_it_while_the_office_and_a_preview_token_do()
    {
        var admin = await _factory.CreateAdminClientAsync();
        await CreateAsync(admin, "Still being written", Blocks, published: false);
        await CreateAsync(admin, "Ready to read", Blocks, published: true);
        var anonymous = _factory.CreateAnonymousClient();
        var member = await _factory.CreateMemberClientAsync();

        foreach (var client in new[] { anonymous, member })
        {
            var slugs = await SlugsAsync(client);
            Assert.Contains("ready-to-read", slugs);
            Assert.DoesNotContain("still-being-written", slugs);
            Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync("/api/pages/still-being-written")).StatusCode);
        }

        var office = await SlugsAsync(admin);
        Assert.Contains("still-being-written", office);
        var unpublished = (await admin.GetFromJsonAsync<JsonObject>("/api/pages/still-being-written"))!["page"]!;
        Assert.False(unpublished["published"]!.GetValue<bool>());

        var token = (await (await admin.PostAsync("/api/site-content/preview-token", null)).Content.ReadFromJsonAsync<JsonObject>())!["token"]!.GetValue<string>();
        var query = $"?preview={Uri.EscapeDataString(token)}";
        Assert.Contains("still-being-written", await SlugsAsync(anonymous, query));
        Assert.Equal(HttpStatusCode.OK, (await anonymous.GetAsync($"/api/pages/still-being-written{query}")).StatusCode);

        // An invalid token falls back to the published-only rules rather than refusing.
        Assert.DoesNotContain("still-being-written", await SlugsAsync(anonymous, "?preview=not-a-token"));
        Assert.Equal(HttpStatusCode.NotFound, (await anonymous.GetAsync("/api/pages/still-being-written?preview=not-a-token")).StatusCode);
    }

    [Fact]
    public async Task Given_a_page_with_a_body_and_no_blocks_when_the_seed_runs_then_it_becomes_one_existing_content_block_once()
    {
        await using var fresh = new CoopApiFactory();
        Guid pageId;
        using (var scope = fresh.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<CoopDbContext>();
            var page = new Coop.Domain.CMS.Page { Title = "Old page", Slug = "old-page", Body = "<p>Old words.</p>", Published = true };
            context.Pages.Add(page);
            await context.SaveChangesAsync();
            pageId = page.PageId;

            var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
            await SeedData.SeedAsync(context, hasher);
            var once = (await context.Pages.SingleAsync(p => p.PageId == pageId)).Sections;
            await SeedData.SeedAsync(context, hasher);
            var again = await context.Pages.SingleAsync(p => p.PageId == pageId);
            Assert.Equal(once, again.Sections);
            Assert.Equal(string.Empty, again.Body);
        }

        var read = (await fresh.CreateAnonymousClient().GetFromJsonAsync<JsonObject>("/api/pages/old-page"))!["page"]!;
        var sections = read["sections"]!.AsArray();
        Assert.Single(sections);
        Assert.Equal("html", sections[0]!["kind"]!.GetValue<string>());
        Assert.Equal("<p>Old words.</p>", sections[0]!["html"]!.GetValue<string>());
    }
}
