// Acceptance Test
// Traces to: L2-REQ-104, L2-REQ-102
// Description: db reset --new-instance leaves roles, privileges, one given
// administrator and the baseline site content, and refuses before deleting
// anything when it is not confirmed or the administrator's options are invalid.

using System.Net.Http.Json;
using System.Text.Json;

namespace Coop.Cli.Tests;

public class NewInstanceResetTests
{
    private static readonly string[] ValidReset =
    {
        "db", "reset", "--new-instance", "--admin-username", "ruth", "--admin-password", "Rooftop-77", "--yes",
    };

    [Fact]
    public async Task Given_no_yes_when_the_reset_runs_then_it_refuses_and_changes_nothing()
    {
        using var host = new CliTestHost();

        var result = await host.RunAsync("db", "reset", "--new-instance", "--admin-username", "ruth", "--admin-password", "Rooftop-77");

        Assert.Equal(1, result.ExitCode);
        Assert.Contains("This deletes every record in the database. Add --yes to confirm.", result.Error);
        Assert.NotNull(await host.SignInAsync("admin", "Admin123!"));
        Assert.Null(await host.SignInAsync("ruth", "Rooftop-77"));
    }

    [Fact]
    public async Task Given_no_administrator_password_when_the_reset_runs_then_it_names_the_missing_option()
    {
        using var host = new CliTestHost();

        var result = await host.RunAsync("db", "reset", "--new-instance", "--admin-username", "ruth", "--yes");

        Assert.NotEqual(0, result.ExitCode);
        Assert.Contains("--admin-password", result.Error);
        Assert.NotNull(await host.SignInAsync("admin", "Admin123!"));
    }

    [Theory]
    [InlineData("ruth", "short")]
    [InlineData("ru", "Rooftop-77")]
    public async Task Given_an_administrator_the_api_would_refuse_when_the_reset_runs_then_the_database_is_not_deleted(string username, string password)
    {
        using var host = new CliTestHost();

        var result = await host.RunAsync("db", "reset", "--new-instance", "--admin-username", username, "--admin-password", password, "--yes");

        Assert.Equal(1, result.ExitCode);
        Assert.StartsWith("Error:", result.Error);
        Assert.Contains("at least", result.Error);
        Assert.DoesNotContain(password, result.Output + result.Error);
        Assert.NotNull(await host.SignInAsync("admin", "Admin123!"));
    }

    [Fact]
    public async Task Given_valid_options_when_the_reset_runs_then_only_the_given_administrator_can_sign_in_and_nothing_else_is_seeded()
    {
        using var host = new CliTestHost();

        var result = await host.RunAsync(ValidReset);

        Assert.Equal(0, result.ExitCode);
        Assert.DoesNotContain("Rooftop-77", result.Output);
        Assert.Null(await host.SignInAsync("admin", "Admin123!"));
        Assert.Null(await host.SignInAsync("member", "Member123!"));

        var admin = await host.CreateClientAsAsync("ruth", "Rooftop-77");
        var users = (await admin.GetFromJsonAsync<JsonElement>("/api/user")).GetProperty("users").EnumerateArray().ToArray();
        var user = Assert.Single(users);
        Assert.Equal("ruth", user.GetProperty("username").GetString());
        Assert.Equal("SystemAdministrator", Assert.Single(user.GetProperty("roles").EnumerateArray()).GetProperty("name").GetString());

        var roles = (await admin.GetFromJsonAsync<JsonElement>("/api/role")).GetProperty("roles").EnumerateArray()
            .Select(r => r.GetProperty("name").GetString()).OrderBy(n => n).ToArray();
        Assert.Equal(new[] { "BoardMember", "Member", "Staff", "Support", "SystemAdministrator" }, roles);

        var siteContent = await host.CreateAnonymousClient().GetFromJsonAsync<JsonElement>("/api/site-content");
        Assert.Equal("OWN Housing Co-op", siteContent.GetProperty("siteContent").GetProperty("header").GetProperty("siteName").GetString());
        Assert.Equal("/own/hero.svg", siteContent.GetProperty("siteContent").GetProperty("home").GetProperty("hero").GetProperty("photo").GetProperty("src").GetString());

        await AssertEmptyAsync(admin, "/api/invitationtoken", "invitationTokens");
        await AssertEmptyAsync(admin, "/api/pages", "pages");
        await AssertEmptyAsync(admin, "/api/board-of-directors", "directors");
        await AssertEmptyAsync(admin, "/api/notice", "notices");
        await AssertEmptyAsync(admin, "/api/bylaw", "byLaws");
        await AssertEmptyAsync(admin, "/api/report", "reports");
        await AssertEmptyAsync(admin, "/api/maintenancerequest", "maintenanceRequests");
        await AssertEmptyAsync(admin, "/api/profiles", "profiles");
        var assets = await admin.GetFromJsonAsync<JsonElement>("/api/digitalasset/page/100/0");
        Assert.Equal(0, assets.GetProperty("totalCount").GetInt32());
    }

    private static async Task AssertEmptyAsync(HttpClient client, string path, string property)
    {
        var body = await client.GetFromJsonAsync<JsonElement>(path);
        Assert.Empty(body.GetProperty(property).EnumerateArray());
    }
}
