// Acceptance Test
// Traces to: L2-REQ-103
// Description: db reset --demo leaves one working sign-in per role, fictional
// profiles for the member, staff and board accounts, photos stored as assets
// behind the public site content, content for every admin screen, and the
// same state when it runs twice.

using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Json;
using System.Text.Json;
using Coop.SharedKernel;

namespace Coop.Cli.Tests;

public class DemoResetTests
{
    public static readonly TheoryData<string, string, string> Accounts = new()
    {
        { "admin", "Admin123!", "SystemAdministrator" },
        { "member", "Member123!", "Member" },
        { "staff", "Staff123!", "Staff" },
        { "board", "Board123!", "BoardMember" },
        { "support", "Support123!", "Support" },
    };

    [Fact]
    public async Task Given_no_yes_when_the_demo_reset_runs_then_it_refuses_and_changes_nothing()
    {
        using var host = new CliTestHost();

        var result = await host.RunAsync("db", "reset", "--demo");

        Assert.Equal(1, result.ExitCode);
        Assert.Contains("This deletes every record in the database. Add --yes to confirm.", result.Error);
        Assert.Null(await host.SignInAsync("staff", "Staff123!"));
    }

    [Theory]
    [MemberData(nameof(Accounts))]
    public async Task Given_the_demo_state_when_each_account_signs_in_then_its_token_carries_its_role(string username, string password, string role)
    {
        using var host = new CliTestHost();
        Assert.Equal(0, (await host.RunAsync("db", "reset", "--demo", "--yes")).ExitCode);

        var token = await host.SignInAsync(username, password);

        Assert.NotNull(token);
        var roles = new JwtSecurityTokenHandler().ReadJwtToken(token).Claims
            .Where(c => c.Type == Constants.ClaimTypes.Role || c.Type == "role")
            .Select(c => c.Value);
        Assert.Equal(new[] { role }, roles);
    }

    [Theory]
    [InlineData("member", "Member123!", 0)]
    [InlineData("board", "Board123!", 1)]
    [InlineData("staff", "Staff123!", 2)]
    public async Task Given_the_demo_state_when_an_account_reads_its_profiles_then_it_has_a_fictional_current_profile_of_its_type(string username, string password, int profileType)
    {
        using var host = new CliTestHost();
        Assert.Equal(0, (await host.RunAsync("db", "reset", "--demo", "--yes")).ExitCode);
        var client = await host.CreateClientAsAsync(username, password);

        var user = (await client.GetFromJsonAsync<JsonElement>("/api/user/current")).GetProperty("user");
        var currentProfileId = user.GetProperty("currentProfileId").GetString();
        Assert.Equal(currentProfileId, user.GetProperty("defaultProfileId").GetString());

        var profiles = (await client.GetFromJsonAsync<JsonElement>($"/api/profiles/by-user/{user.GetProperty("userId").GetString()}"))
            .GetProperty("profiles").EnumerateArray().ToArray();
        var profile = Assert.Single(profiles);
        Assert.Equal(currentProfileId, profile.GetProperty("profileId").GetString());
        Assert.Equal(profileType, profile.GetProperty("type").GetInt32());
        Assert.NotEqual("Test", profile.GetProperty("firstname").GetString());
        Assert.EndsWith(".test", profile.GetProperty("email").GetString());
    }

    [Fact]
    public async Task Given_the_demo_state_when_the_public_site_content_is_read_then_every_photo_is_a_stored_asset_with_its_description()
    {
        using var host = new CliTestHost();
        Assert.Equal(0, (await host.RunAsync("db", "reset", "--demo", "--yes")).ExitCode);
        var anonymous = host.CreateAnonymousClient();

        var content = (await anonymous.GetFromJsonAsync<JsonElement>("/api/site-content")).GetProperty("siteContent");
        var home = content.GetProperty("home");
        var photos = new List<JsonElement> { home.GetProperty("hero").GetProperty("photo"), home.GetProperty("quote").GetProperty("photo") };
        photos.AddRange(home.GetProperty("gallery").GetProperty("photos").EnumerateArray().Select(p => p.GetProperty("photo")));
        photos.AddRange(home.GetProperty("features").GetProperty("rows").EnumerateArray().Select(r => r.GetProperty("photo")));
        Assert.Equal(10, photos.Count);

        foreach (var photo in photos)
        {
            var src = photo.GetProperty("src").GetString()!;
            Assert.StartsWith("http://localhost:5000/api/digitalasset/serve/", src);
            Assert.False(string.IsNullOrWhiteSpace(photo.GetProperty("alt").GetString()));
            Assert.True(photo.GetProperty("width").GetInt32() > 0);
            await AssertServesSvgAsync(anonymous, src);
        }
    }

    [Fact]
    public async Task Given_an_api_url_when_the_demo_reset_runs_then_the_photos_are_addressed_from_it()
    {
        using var host = new CliTestHost();
        Assert.Equal(0, (await host.RunAsync("db", "reset", "--demo", "--yes", "--api-url", "https://coop.example/api")).ExitCode);

        var content = (await host.CreateAnonymousClient().GetFromJsonAsync<JsonElement>("/api/site-content")).GetProperty("siteContent");

        Assert.StartsWith("https://coop.example/api/digitalasset/serve/",
            content.GetProperty("home").GetProperty("hero").GetProperty("photo").GetProperty("src").GetString());
    }

    [Fact]
    public async Task Given_the_demo_state_when_the_pages_and_board_are_read_then_they_show_photos_from_the_assets()
    {
        using var host = new CliTestHost();
        Assert.Equal(0, (await host.RunAsync("db", "reset", "--demo", "--yes")).ExitCode);
        var anonymous = host.CreateAnonymousClient();

        var pages = (await anonymous.GetFromJsonAsync<JsonElement>("/api/pages")).GetProperty("pages").EnumerateArray().ToArray();
        Assert.True(pages.Length >= 2);
        foreach (var page in pages)
        {
            await AssertServesSvgAsync(anonymous, page.GetProperty("heroImageUrl").GetString()!);
            Assert.False(string.IsNullOrWhiteSpace(page.GetProperty("heroImageAlt").GetString()));
        }

        var directors = (await anonymous.GetFromJsonAsync<JsonElement>("/api/board-of-directors")).GetProperty("directors").EnumerateArray().ToArray();
        Assert.Equal(4, directors.Length);
        foreach (var director in directors)
            await AssertServesSvgAsync(anonymous, director.GetProperty("photoUrl").GetString()!);

        var admin = await host.CreateClientAsAsync("admin", "Admin123!");
        var assets = await admin.GetFromJsonAsync<JsonElement>("/api/digitalasset/page/100/0");
        Assert.Equal(11, assets.GetProperty("totalCount").GetInt32());
    }

    private static async Task AssertServesSvgAsync(HttpClient client, string address)
    {
        var path = new Uri(address).AbsolutePath;
        var response = await client.GetAsync(path);
        response.EnsureSuccessStatusCode();
        Assert.Equal("image/svg+xml", response.Content.Headers.ContentType?.MediaType);
        Assert.StartsWith("<svg", await response.Content.ReadAsStringAsync());
    }
}
