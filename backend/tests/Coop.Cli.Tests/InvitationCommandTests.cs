// Acceptance Test
// Traces to: L2-REQ-107, L2-REQ-043, L2-REQ-044
// Description: invitation list, create and remove through the same handlers
// as the API; the API validates what the tool creates, a repeated create
// returns the existing token, and a removed token no longer lists.

using System.Net.Http.Json;
using System.Text.Json;

namespace Coop.Cli.Tests;

public class InvitationCommandTests : IClassFixture<CliTestHost>
{
    private readonly CliTestHost _host;

    public InvitationCommandTests(CliTestHost host) => _host = host;

    private async Task<bool> ValidAsync(string value)
    {
        var body = await _host.CreateAnonymousClient().GetFromJsonAsync<JsonElement>($"/api/invitationtoken/validate/{value}");
        return body.GetProperty("success").GetBoolean();
    }

    [Fact]
    public async Task Given_the_seeded_tokens_when_the_operator_lists_them_then_each_shows_its_value_and_type()
    {
        var result = await _host.RunAsync("invitation", "list");

        Assert.Equal(0, result.ExitCode);
        Assert.Matches(@"valid-invitation-token\s+Member", result.Output);
    }

    [Fact]
    public async Task Given_a_value_when_the_operator_creates_a_token_twice_then_one_valid_token_exists()
    {
        var first = await _host.RunAsync("invitation", "create", "--value", "spring-2027", "--type", "BoardMember", "--expires", "2099-06-30");
        var second = await _host.RunAsync("invitation", "create", "--value", "spring-2027", "--type", "Member");

        Assert.Equal(0, first.ExitCode);
        Assert.Equal(0, second.ExitCode);
        Assert.True(await ValidAsync("spring-2027"));
        var list = (await _host.RunAsync("invitation", "list")).Output.Split('\n').Where(l => l.StartsWith("spring-2027")).ToArray();
        var line = Assert.Single(list);
        Assert.Contains("BoardMember", line);
        Assert.Contains("2099-06-30", line);
    }

    [Fact]
    public async Task Given_an_expiry_date_in_the_past_when_the_operator_creates_a_token_then_the_api_treats_it_as_invalid()
    {
        Assert.Equal(0, (await _host.RunAsync("invitation", "create", "--value", "old-2020", "--type", "Member", "--expires", "2020-01-31")).ExitCode);

        Assert.False(await ValidAsync("old-2020"));
    }

    [Fact]
    public async Task Given_an_empty_value_when_the_operator_creates_a_token_then_it_is_refused()
    {
        var result = await _host.RunAsync("invitation", "create", "--value", " ", "--type", "Member");

        Assert.Equal(1, result.ExitCode);
        Assert.StartsWith("Error:", result.Error);
    }

    [Fact]
    public async Task Given_a_token_when_the_operator_removes_it_then_it_no_longer_lists_or_validates()
    {
        await _host.RunAsync("invitation", "create", "--value", "summer-2027", "--type", "StaffMember");

        var result = await _host.RunAsync("invitation", "remove", "--value", "summer-2027");

        Assert.Equal(0, result.ExitCode);
        Assert.DoesNotContain("summer-2027", (await _host.RunAsync("invitation", "list")).Output);
        Assert.False(await ValidAsync("summer-2027"));
        var missing = await _host.RunAsync("invitation", "remove", "--value", "summer-2027");
        Assert.Equal(1, missing.ExitCode);
        Assert.Contains("No invitation with the value \"summer-2027\".", missing.Error);
    }
}
