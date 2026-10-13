// Acceptance Test
// Traces to: L2-REQ-080, L2-REQ-081
// Description: Website pages through the API: anonymous reads, idempotent
// creation with a derived slug, update, removal, validation, and refusal of
// members and anonymous callers.

using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace Coop.Api.Tests;

public class PagesTests : IClassFixture<CoopApiFactory>
{
    private readonly CoopApiFactory _factory;

    public PagesTests(CoopApiFactory factory) => _factory = factory;

    private static async Task<JsonElement> CreatePageAsync(HttpClient admin, string title, string body = "<p>Some text.</p>", string? heroImageUrl = null)
    {
        var response = await admin.PostAsJsonAsync("/api/pages", new { title, body, heroImageUrl });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        return json.GetProperty("page");
    }

    private static async Task<JsonElement[]> ListPagesAsync(HttpClient client)
    {
        var json = await client.GetFromJsonAsync<JsonElement>("/api/pages");
        return json.GetProperty("pages").EnumerateArray().ToArray();
    }

    [Fact]
    public async Task Given_an_admin_creates_a_page_then_visitors_can_list_and_read_it_without_signing_in()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var created = await CreatePageAsync(admin, "About us", "<h2>Our story</h2><p>In 1997 the doors opened.</p>", "/own/lobby.svg");

        Assert.Equal("about-us", created.GetProperty("slug").GetString());

        var anonymous = _factory.CreateAnonymousClient();
        var listed = await ListPagesAsync(anonymous);
        Assert.Contains(listed, p => p.GetProperty("slug").GetString() == "about-us");

        var response = await anonymous.GetAsync("/api/pages/about-us");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var page = (await response.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("page");
        Assert.Equal("About us", page.GetProperty("title").GetString());
        Assert.Equal("/own/lobby.svg", page.GetProperty("heroImageUrl").GetString());
        Assert.Contains("Our story", page.GetProperty("body").GetString());
    }

    [Fact]
    public async Task Given_a_title_with_accents_and_punctuation_then_the_slug_is_plain_and_re_posting_returns_the_same_page()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var first = await CreatePageAsync(admin, "Café & Garden!");
        Assert.Equal("cafe-garden", first.GetProperty("slug").GetString());

        var second = await CreatePageAsync(admin, "Café & Garden!", "<p>Different text.</p>");
        Assert.Equal(first.GetProperty("pageId").GetString(), second.GetProperty("pageId").GetString());
        Assert.Equal("<p>Some text.</p>", second.GetProperty("body").GetString());

        var listed = await ListPagesAsync(_factory.CreateAnonymousClient());
        Assert.Single(listed, p => p.GetProperty("slug").GetString() == "cafe-garden");
    }

    [Fact]
    public async Task Given_an_existing_page_when_the_admin_updates_it_then_the_new_slug_serves_it_and_the_old_one_is_gone()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var created = await CreatePageAsync(admin, "Our garden");
        var pageId = created.GetProperty("pageId").GetString();

        var response = await admin.PutAsJsonAsync("/api/pages", new
        {
            pageId,
            title = "Our rooftop garden",
            heroImageUrl = (string?)null,
            body = "<p>Tomatoes in August.</p>",
        });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var anonymous = _factory.CreateAnonymousClient();
        var updated = (await anonymous.GetFromJsonAsync<JsonElement>("/api/pages/our-rooftop-garden")).GetProperty("page");
        Assert.Equal("Our rooftop garden", updated.GetProperty("title").GetString());
        Assert.Equal("<p>Tomatoes in August.</p>", updated.GetProperty("body").GetString());

        var old = await anonymous.GetAsync("/api/pages/our-garden");
        Assert.Equal(HttpStatusCode.NotFound, old.StatusCode);
    }

    [Fact]
    public async Task Given_two_pages_when_one_is_renamed_to_the_other_title_then_the_update_is_rejected()
    {
        var admin = await _factory.CreateAdminClientAsync();
        await CreatePageAsync(admin, "Tuesday tea");
        var second = await CreatePageAsync(admin, "Thursday choir");

        var response = await admin.PutAsJsonAsync("/api/pages", new
        {
            pageId = second.GetProperty("pageId").GetString(),
            title = "Tuesday Tea",
            body = "<p>Moved.</p>",
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("A page with this title already exists.", body);
    }

    [Fact]
    public async Task Given_an_existing_page_when_the_admin_removes_it_then_it_leaves_the_list_and_its_address_is_not_found()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var created = await CreatePageAsync(admin, "Knitting circle");
        var pageId = created.GetProperty("pageId").GetString();

        var response = await admin.DeleteAsync($"/api/pages/{pageId}");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var anonymous = _factory.CreateAnonymousClient();
        var listed = await ListPagesAsync(anonymous);
        Assert.DoesNotContain(listed, p => p.GetProperty("slug").GetString() == "knitting-circle");
        var gone = await anonymous.GetAsync("/api/pages/knitting-circle");
        Assert.Equal(HttpStatusCode.NotFound, gone.StatusCode);
    }

    [Fact]
    public async Task Given_a_member_when_they_call_the_page_management_endpoints_then_the_api_refuses_and_nothing_changes()
    {
        var admin = await _factory.CreateAdminClientAsync();
        var created = await CreatePageAsync(admin, "Members only test page");
        var pageId = created.GetProperty("pageId").GetString();

        var member = await _factory.CreateMemberClientAsync();

        var create = await member.PostAsJsonAsync("/api/pages", new { title = "Member page", body = "<p>Nope.</p>" });
        Assert.Equal(HttpStatusCode.Forbidden, create.StatusCode);

        var update = await member.PutAsJsonAsync("/api/pages", new { pageId, title = "Changed by a member", body = "<p>Nope.</p>" });
        Assert.Equal(HttpStatusCode.Forbidden, update.StatusCode);

        var remove = await member.DeleteAsync($"/api/pages/{pageId}");
        Assert.Equal(HttpStatusCode.Forbidden, remove.StatusCode);

        var anonymous = _factory.CreateAnonymousClient();
        var listed = await ListPagesAsync(anonymous);
        Assert.DoesNotContain(listed, p => p.GetProperty("slug").GetString() == "member-page");
        var unchanged = (await anonymous.GetFromJsonAsync<JsonElement>("/api/pages/members-only-test-page")).GetProperty("page");
        Assert.Equal("Members only test page", unchanged.GetProperty("title").GetString());
    }

    [Fact]
    public async Task Given_an_anonymous_visitor_when_they_call_the_page_management_endpoints_then_the_api_answers_401()
    {
        var anonymous = _factory.CreateAnonymousClient();

        var create = await anonymous.PostAsJsonAsync("/api/pages", new { title = "Anonymous page", body = "<p>Nope.</p>" });
        Assert.Equal(HttpStatusCode.Unauthorized, create.StatusCode);

        var update = await anonymous.PutAsJsonAsync("/api/pages", new { pageId = Guid.NewGuid(), title = "x", body = "y" });
        Assert.Equal(HttpStatusCode.Unauthorized, update.StatusCode);

        var remove = await anonymous.DeleteAsync($"/api/pages/{Guid.NewGuid()}");
        Assert.Equal(HttpStatusCode.Unauthorized, remove.StatusCode);
    }

    [Theory]
    [InlineData("", "<p>Text</p>")]
    [InlineData("   ", "<p>Text</p>")]
    [InlineData("!!!", "<p>Text</p>")]
    [InlineData("A valid title", "")]
    public async Task Given_an_empty_title_a_title_without_letters_or_an_empty_body_then_the_create_is_rejected(string title, string body)
    {
        var admin = await _factory.CreateAdminClientAsync();

        var response = await admin.PostAsJsonAsync("/api/pages", new { title, body });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Given_an_unknown_slug_then_reading_it_answers_404()
    {
        var response = await _factory.CreateAnonymousClient().GetAsync("/api/pages/no-such-page");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
