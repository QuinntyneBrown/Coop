// Acceptance Test
// Traces to: L2-REQ-085, L2-REQ-086
// Description: The Board of Directors list through the API: anonymous reads in
// the saved order, whole-list replacement stored as the BoardOfDirectors JSON
// content the home page reads, validation, and refusal of members and
// anonymous callers.

using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace Coop.Api.Tests;

public class BoardOfDirectorsTests : IClassFixture<CoopApiFactory>
{
    private readonly CoopApiFactory _factory;

    public BoardOfDirectorsTests(CoopApiFactory factory) => _factory = factory;

    private static async Task<JsonElement[]> ListDirectorsAsync(HttpClient client)
    {
        var json = await client.GetFromJsonAsync<JsonElement>("/api/board-of-directors");
        return json.GetProperty("directors").EnumerateArray().ToArray();
    }

    private static Task<HttpResponseMessage> SaveDirectorsAsync(HttpClient client, params object[] directors)
        => client.PutAsJsonAsync("/api/board-of-directors", new { directors });

    private static string[] NamesOf(IEnumerable<JsonElement> directors)
        => directors.Select(d => d.GetProperty("name").GetString()!).ToArray();

    [Fact]
    public async Task Given_the_seeded_board_then_visitors_can_read_it_without_signing_in()
    {
        var directors = await ListDirectorsAsync(_factory.CreateAnonymousClient());

        Assert.NotEmpty(directors);
        Assert.All(directors, d =>
        {
            Assert.False(string.IsNullOrWhiteSpace(d.GetProperty("name").GetString()));
            Assert.False(string.IsNullOrWhiteSpace(d.GetProperty("title").GetString()));
        });
    }

    [Fact]
    public async Task Given_an_admin_adds_a_director_and_saves_then_the_director_appears_in_the_public_board_content()
    {
        var admin = await _factory.CreateAdminClientAsync();

        var response = await SaveDirectorsAsync(admin,
            new { name = "Beatrice Hollis", title = "President", photoUrl = (string?)null },
            new { name = "Winifred Osei", title = "Treasurer", photoUrl = "http://localhost:5000/api/digitalasset/serve/5f0c" });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var anonymous = _factory.CreateAnonymousClient();
        var listed = await ListDirectorsAsync(anonymous);
        Assert.Equal(new[] { "Beatrice Hollis", "Winifred Osei" }, NamesOf(listed));
        Assert.Equal("Treasurer", listed[1].GetProperty("title").GetString());
        Assert.Equal("http://localhost:5000/api/digitalasset/serve/5f0c", listed[1].GetProperty("photoUrl").GetString());
        Assert.Equal(JsonValueKind.Null, listed[0].GetProperty("photoUrl").ValueKind);

        // The home page reads the BoardOfDirectors JSON content (L2-REQ-070 AC2).
        var content = await anonymous.GetFromJsonAsync<JsonElement>("/api/jsoncontent/name/BoardOfDirectors");
        var json = JsonDocument.Parse(content.GetProperty("jsonContent").GetProperty("json").GetString()!).RootElement;
        var members = json.GetProperty("members").EnumerateArray().ToArray();
        Assert.Equal(new[] { "Beatrice Hollis", "Winifred Osei" }, NamesOf(members));
        Assert.Equal("Treasurer", members[1].GetProperty("title").GetString());
        Assert.Equal("http://localhost:5000/api/digitalasset/serve/5f0c", members[1].GetProperty("photoUrl").GetString());
    }

    [Fact]
    public async Task Given_a_director_on_the_list_when_the_admin_removes_them_then_they_no_longer_appear_publicly()
    {
        var admin = await _factory.CreateAdminClientAsync();
        await SaveDirectorsAsync(admin,
            new { name = "Agnes Moreau", title = "President" },
            new { name = "Clara Szabo", title = "Secretary" });

        var response = await SaveDirectorsAsync(admin, new { name = "Agnes Moreau", title = "President" });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var listed = await ListDirectorsAsync(_factory.CreateAnonymousClient());
        Assert.Equal(new[] { "Agnes Moreau" }, NamesOf(listed));
    }

    [Fact]
    public async Task Given_a_reordered_list_when_the_admin_saves_it_then_visitors_see_the_new_order_and_re_sending_it_changes_nothing()
    {
        var admin = await _factory.CreateAdminClientAsync();
        await SaveDirectorsAsync(admin,
            new { name = "Agnes Moreau", title = "President" },
            new { name = "Clara Szabo", title = "Secretary" });

        object[] reordered =
        {
            new { name = "Clara Szabo", title = "Secretary" },
            new { name = "Agnes Moreau", title = "President" },
        };
        var first = await SaveDirectorsAsync(admin, reordered);
        var second = await SaveDirectorsAsync(admin, reordered);
        Assert.Equal(HttpStatusCode.OK, first.StatusCode);
        Assert.Equal(HttpStatusCode.OK, second.StatusCode);

        var saved = (await second.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("directors").EnumerateArray();
        Assert.Equal(new[] { "Clara Szabo", "Agnes Moreau" }, NamesOf(saved));
        var listed = await ListDirectorsAsync(_factory.CreateAnonymousClient());
        Assert.Equal(new[] { "Clara Szabo", "Agnes Moreau" }, NamesOf(listed));
    }

    [Fact]
    public async Task Given_a_member_when_they_save_the_board_list_then_the_api_refuses_and_nothing_changes()
    {
        var admin = await _factory.CreateAdminClientAsync();
        await SaveDirectorsAsync(admin, new { name = "Agnes Moreau", title = "President" });

        var member = await _factory.CreateMemberClientAsync();
        var response = await SaveDirectorsAsync(member, new { name = "Changed by a member", title = "President" });
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);

        var listed = await ListDirectorsAsync(_factory.CreateAnonymousClient());
        Assert.Equal(new[] { "Agnes Moreau" }, NamesOf(listed));
    }

    [Fact]
    public async Task Given_an_anonymous_visitor_when_they_save_the_board_list_then_the_api_answers_401()
    {
        var response = await SaveDirectorsAsync(_factory.CreateAnonymousClient(), new { name = "Anonymous", title = "President" });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Theory]
    [InlineData("", "President", null)]
    [InlineData("   ", "President", null)]
    [InlineData("Agnes Moreau", "", null)]
    [InlineData("Agnes Moreau", "President", "too-long")]
    [InlineData("long-name", "President", null)]
    public async Task Given_a_director_with_a_missing_or_too_long_field_then_the_save_is_rejected_and_nothing_changes(string name, string title, string? photoUrl)
    {
        var admin = await _factory.CreateAdminClientAsync();
        await SaveDirectorsAsync(admin, new { name = "Agnes Moreau", title = "President" });

        if (name == "long-name") name = new string('a', 101);
        if (photoUrl == "too-long") photoUrl = "https://example.test/" + new string('a', 2048);

        var response = await SaveDirectorsAsync(admin, new { name, title, photoUrl });
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var listed = await ListDirectorsAsync(_factory.CreateAnonymousClient());
        Assert.Equal(new[] { "Agnes Moreau" }, NamesOf(listed));
    }
}
