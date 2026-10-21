// Acceptance Test
// Traces to: L2-REQ-105, L2-REQ-102, L2-REQ-001, L2-REQ-003, L2-REQ-005, L2-REQ-013
// Description: user list, create, rename, set-password, add-role,
// remove-role and remove through the same handlers as the API, checked by
// signing in through the API; taken usernames, weak passwords, unknown
// names and the last system administrator are refused.

using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Coop.SharedKernel;

namespace Coop.Cli.Tests;

public class UserCommandTests : IClassFixture<CliTestHost>
{
    private readonly CliTestHost _host;

    public UserCommandTests(CliTestHost host) => _host = host;

    private async Task<string[]> RolesInTokenAsync(string username, string password)
    {
        var token = await _host.SignInAsync(username, password);
        Assert.NotNull(token);
        return new JwtSecurityTokenHandler().ReadJwtToken(token).Claims
            .Where(c => c.Type == Constants.ClaimTypes.Role || c.Type == "role")
            .Select(c => c.Value).Order().ToArray();
    }

    [Fact]
    public async Task Given_users_when_the_operator_lists_them_then_each_shows_with_its_roles_and_no_secret()
    {
        var result = await _host.RunAsync("user", "list");

        Assert.Equal(0, result.ExitCode);
        Assert.Matches(@"admin\s+SystemAdministrator", result.Output);
        Assert.Matches(@"member\s+Member", result.Output);
        Assert.DoesNotContain("Admin123!", result.Output);
        Assert.DoesNotContain("salt", result.Output, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("password", result.Output, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Given_a_new_username_when_the_operator_creates_a_user_with_roles_then_the_user_signs_in_with_those_roles()
    {
        var result = await _host.RunAsync("user", "create", "--username", "edna", "--password", "Garden12", "--role", "Member", "--role", "BoardMember");

        Assert.Equal(0, result.ExitCode);
        Assert.Contains("edna", result.Output);
        Assert.DoesNotContain("Garden12", result.Output);
        Assert.Equal(new[] { "BoardMember", "Member" }, await RolesInTokenAsync("edna", "Garden12"));
    }

    [Fact]
    public async Task Given_a_taken_username_when_the_operator_creates_a_user_then_it_is_refused()
    {
        var result = await _host.RunAsync("user", "create", "--username", "member", "--password", "Another99");

        Assert.Equal(1, result.ExitCode);
        Assert.Contains("The username \"member\" is already taken.", result.Error);
        Assert.NotNull(await _host.SignInAsync("member", "Member123!"));
    }

    [Fact]
    public async Task Given_a_weak_password_when_the_operator_creates_a_user_then_it_is_refused()
    {
        var result = await _host.RunAsync("user", "create", "--username", "weakling", "--password", "abc");

        Assert.Equal(1, result.ExitCode);
        Assert.StartsWith("Error:", result.Error);
        Assert.Null(await _host.SignInAsync("weakling", "abc"));
    }

    [Fact]
    public async Task Given_an_unknown_role_when_the_operator_creates_a_user_then_it_names_the_role()
    {
        var result = await _host.RunAsync("user", "create", "--username", "wanda", "--password", "Wizard123", "--role", "Wizard");

        Assert.Equal(1, result.ExitCode);
        Assert.Contains("No role named \"Wizard\".", result.Error);
        Assert.Null(await _host.SignInAsync("wanda", "Wizard123"));
    }

    [Fact]
    public async Task Given_a_user_when_the_operator_renames_them_then_they_sign_in_with_the_new_name_and_keep_their_roles()
    {
        await _host.RunAsync("user", "create", "--username", "olive", "--password", "Olive1234", "--role", "Staff");

        var result = await _host.RunAsync("user", "rename", "--username", "olive", "--new-username", "olive.b");

        Assert.Equal(0, result.ExitCode);
        Assert.Null(await _host.SignInAsync("olive", "Olive1234"));
        Assert.Equal(new[] { "Staff" }, await RolesInTokenAsync("olive.b", "Olive1234"));
    }

    [Fact]
    public async Task Given_a_name_another_user_holds_when_the_operator_renames_a_user_then_it_is_refused()
    {
        await _host.RunAsync("user", "create", "--username", "iris", "--password", "Iris12345");

        var result = await _host.RunAsync("user", "rename", "--username", "iris", "--new-username", "admin");

        Assert.Equal(1, result.ExitCode);
        Assert.Contains("The username \"admin\" is already taken.", result.Error);
        Assert.NotNull(await _host.SignInAsync("iris", "Iris12345"));
    }

    [Fact]
    public async Task Given_a_user_when_the_operator_sets_a_password_then_only_the_new_password_signs_in()
    {
        await _host.RunAsync("user", "create", "--username", "maeve", "--password", "Maeve1234");

        var result = await _host.RunAsync("user", "set-password", "--username", "maeve", "--password", "Brand-new-77");

        Assert.Equal(0, result.ExitCode);
        Assert.DoesNotContain("Brand-new-77", result.Output);
        Assert.NotNull(await _host.SignInAsync("maeve", "Brand-new-77"));
        Assert.Null(await _host.SignInAsync("maeve", "Maeve1234"));
    }

    [Fact]
    public async Task Given_a_weak_password_when_the_operator_sets_it_then_it_is_refused_and_the_old_one_works()
    {
        await _host.RunAsync("user", "create", "--username", "nell", "--password", "Nell12345");

        var result = await _host.RunAsync("user", "set-password", "--username", "nell", "--password", "abc");

        Assert.Equal(1, result.ExitCode);
        Assert.StartsWith("Error:", result.Error);
        Assert.NotNull(await _host.SignInAsync("nell", "Nell12345"));
    }

    [Fact]
    public async Task Given_a_user_when_the_operator_adds_and_removes_roles_then_the_token_follows()
    {
        await _host.RunAsync("user", "create", "--username", "flora", "--password", "Flora1234", "--role", "Member");

        Assert.Equal(0, (await _host.RunAsync("user", "add-role", "--username", "flora", "--role", "Staff")).ExitCode);
        Assert.Equal(0, (await _host.RunAsync("user", "add-role", "--username", "flora", "--role", "Staff")).ExitCode);
        Assert.Equal(new[] { "Member", "Staff" }, await RolesInTokenAsync("flora", "Flora1234"));

        Assert.Equal(0, (await _host.RunAsync("user", "remove-role", "--username", "flora", "--role", "Member")).ExitCode);
        Assert.Equal(new[] { "Staff" }, await RolesInTokenAsync("flora", "Flora1234"));
    }

    [Fact]
    public async Task Given_a_user_when_the_operator_removes_them_then_they_can_no_longer_sign_in()
    {
        await _host.RunAsync("user", "create", "--username", "gwen", "--password", "Gwen12345");

        var result = await _host.RunAsync("user", "remove", "--username", "gwen");

        Assert.Equal(0, result.ExitCode);
        Assert.Null(await _host.SignInAsync("gwen", "Gwen12345"));
        Assert.DoesNotContain("gwen", (await _host.RunAsync("user", "list")).Output);
    }

    [Theory]
    [InlineData("rename", "--new-username", "ghost2")]
    [InlineData("set-password", "--password", "Ghost1234")]
    [InlineData("add-role", "--role", "Member")]
    [InlineData("remove", null, null)]
    public async Task Given_no_such_user_when_a_user_command_runs_then_it_says_so(string command, string? option, string? value)
    {
        var args = new List<string> { "user", command, "--username", "ghost" };
        if (option is not null)
            args.AddRange(new[] { option, value! });

        var result = await _host.RunAsync(args.ToArray());

        Assert.Equal(1, result.ExitCode);
        Assert.Contains("No user named \"ghost\".", result.Error);
    }

    [Fact]
    public async Task Given_the_last_system_administrator_when_the_operator_removes_them_or_their_role_then_it_is_refused()
    {
        using var host = new CliTestHost();

        var remove = await host.RunAsync("user", "remove", "--username", "admin");
        var removeRole = await host.RunAsync("user", "remove-role", "--username", "admin", "--role", "SystemAdministrator");

        Assert.Equal(1, remove.ExitCode);
        Assert.Contains("At least one system administrator must remain.", remove.Error);
        Assert.Equal(1, removeRole.ExitCode);
        Assert.Contains("At least one system administrator must remain.", removeRole.Error);
        Assert.NotNull(await host.SignInAsync("admin", "Admin123!"));

        var admin = await host.CreateClientAsAsync("admin", "Admin123!");
        var users = (await admin.GetFromJsonAsync<JsonElement>("/api/user")).GetProperty("users").EnumerateArray();
        var adminId = users.Single(u => u.GetProperty("username").GetString() == "admin").GetProperty("userId").GetString();
        var response = await admin.DeleteAsync($"/api/user/{adminId}");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        // With a second administrator, the first can go.
        await host.RunAsync("user", "create", "--username", "second", "--password", "Second123", "--role", "SystemAdministrator");
        Assert.Equal(0, (await host.RunAsync("user", "remove-role", "--username", "admin", "--role", "SystemAdministrator")).ExitCode);
    }
}
