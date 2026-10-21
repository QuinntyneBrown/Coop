// Acceptance Test
// Traces to: L2-REQ-106, L2-REQ-010, L2-REQ-011, L2-REQ-007
// Description: role list, create, remove, grant and revoke through the same
// handlers as the API; a granted privilege reaches the token the API issues.

using System.IdentityModel.Tokens.Jwt;
using Coop.SharedKernel;

namespace Coop.Cli.Tests;

public class RoleCommandTests : IClassFixture<CliTestHost>
{
    private readonly CliTestHost _host;

    public RoleCommandTests(CliTestHost host) => _host = host;

    private async Task<string[]> PrivilegesInTokenAsync(string username, string password)
    {
        var token = await _host.SignInAsync(username, password);
        Assert.NotNull(token);
        return new JwtSecurityTokenHandler().ReadJwtToken(token).Claims
            .Where(c => c.Type == Constants.ClaimTypes.Privilege)
            .Select(c => c.Value).Order().ToArray();
    }

    private async Task<string> RoleLineAsync(string role)
    {
        var list = await _host.RunAsync("role", "list");
        return list.Output.Split('\n').SingleOrDefault(line => line.StartsWith(role + " ")) ?? string.Empty;
    }

    [Fact]
    public async Task Given_the_seeded_roles_when_the_operator_lists_them_then_each_shows_its_privileges()
    {
        var result = await _host.RunAsync("role", "list");

        Assert.Equal(0, result.ExitCode);
        Assert.Contains("Delete:User", await RoleLineAsync("SystemAdministrator"));
        Assert.Contains("Read:Notice", await RoleLineAsync("Member"));
    }

    [Fact]
    public async Task Given_a_role_name_when_the_operator_creates_it_twice_then_there_is_one_role()
    {
        Assert.Equal(0, (await _host.RunAsync("role", "create", "--name", "Gardener")).ExitCode);
        Assert.Equal(0, (await _host.RunAsync("role", "create", "--name", "Gardener")).ExitCode);

        var list = await _host.RunAsync("role", "list");
        Assert.Single(list.Output.Split('\n'), line => line.StartsWith("Gardener"));
    }

    [Fact]
    public async Task Given_a_role_when_the_operator_grants_and_revokes_a_privilege_then_the_token_follows()
    {
        await _host.RunAsync("role", "create", "--name", "Volunteer");
        await _host.RunAsync("user", "create", "--username", "vera", "--password", "Vera12345", "--role", "Volunteer");

        Assert.Equal(0, (await _host.RunAsync("role", "grant", "--role", "Volunteer", "--aggregate", "Notice", "--access", "Read")).ExitCode);
        Assert.Equal(0, (await _host.RunAsync("role", "grant", "--role", "Volunteer", "--aggregate", "Notice", "--access", "Read")).ExitCode);
        Assert.Equal(new[] { "Read:Notice" }, await PrivilegesInTokenAsync("vera", "Vera12345"));

        Assert.Equal(0, (await _host.RunAsync("role", "revoke", "--role", "Volunteer", "--aggregate", "Notice", "--access", "Read")).ExitCode);
        Assert.Empty(await PrivilegesInTokenAsync("vera", "Vera12345"));

        var again = await _host.RunAsync("role", "revoke", "--role", "Volunteer", "--aggregate", "Notice", "--access", "Read");
        Assert.Equal(1, again.ExitCode);
        Assert.Contains("The role \"Volunteer\" has no Read privilege on Notice.", again.Error);
    }

    [Fact]
    public async Task Given_an_unknown_aggregate_when_the_operator_grants_it_then_it_is_refused()
    {
        await _host.RunAsync("role", "create", "--name", "Painter");

        var result = await _host.RunAsync("role", "grant", "--role", "Painter", "--aggregate", "Paint", "--access", "Write");

        Assert.Equal(1, result.ExitCode);
        Assert.Contains("Unknown aggregate \"Paint\".", result.Error);
        Assert.DoesNotContain("Paint", (await RoleLineAsync("Painter")).Replace("Painter", string.Empty));
    }

    [Fact]
    public async Task Given_an_unknown_role_when_the_operator_grants_then_it_names_the_role()
    {
        var result = await _host.RunAsync("role", "grant", "--role", "Nobody", "--aggregate", "Notice", "--access", "Read");

        Assert.Equal(1, result.ExitCode);
        Assert.Contains("No role named \"Nobody\".", result.Error);
    }

    [Fact]
    public async Task Given_a_role_held_by_a_user_when_the_operator_removes_it_then_the_role_and_its_privileges_are_gone()
    {
        await _host.RunAsync("role", "create", "--name", "Knitter");
        await _host.RunAsync("role", "grant", "--role", "Knitter", "--aggregate", "Message", "--access", "Write");
        await _host.RunAsync("user", "create", "--username", "kit", "--password", "Kitty1234", "--role", "Knitter");

        var result = await _host.RunAsync("role", "remove", "--name", "Knitter");

        Assert.Equal(0, result.ExitCode);
        Assert.Equal(string.Empty, await RoleLineAsync("Knitter"));
        Assert.Empty(await PrivilegesInTokenAsync("kit", "Kitty1234"));
    }

    [Fact]
    public async Task Given_the_system_administrator_role_when_the_operator_removes_it_then_it_is_refused()
    {
        var result = await _host.RunAsync("role", "remove", "--name", "SystemAdministrator");

        Assert.Equal(1, result.ExitCode);
        Assert.Contains("The SystemAdministrator role cannot be removed.", result.Error);
        Assert.NotEqual(string.Empty, await RoleLineAsync("SystemAdministrator"));
    }
}
