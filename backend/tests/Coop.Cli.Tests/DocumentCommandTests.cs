// Acceptance Test
// Traces to: L2-REQ-109, L2-REQ-031, L2-REQ-032, L2-REQ-033, L2-REQ-034, L2-REQ-093
// Description: notice, bylaw and report list, create, update, publish and
// remove, and sending a published notice once, through the same handlers as
// the API, checked through the API and the recording notice sender.

using System.Net.Http.Json;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Coop.Cli.Tests;

public class DocumentCommandTests : IClassFixture<CliTestHost>
{
    private readonly CliTestHost _host;

    public DocumentCommandTests(CliTestHost host) => _host = host;

    private static string IdIn(string output)
        => Regex.Match(output, "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}").Value;

    private async Task<string[]> PublishedAsync(string type)
    {
        var property = type switch { "notice" => "notices", "bylaw" => "byLaws", _ => "reports" };
        var body = await _host.CreateAnonymousClient().GetFromJsonAsync<JsonElement>($"/api/{type}/published");
        return body.GetProperty(property).EnumerateArray().Select(d => d.GetProperty("name").GetString()!).ToArray();
    }

    [Theory]
    [InlineData("notice", "--body", "Bring a plate to share.")]
    [InlineData("report", "--body", "Spending stayed within the budget.")]
    [InlineData("bylaw", null, null)]
    public async Task Given_a_document_when_the_operator_creates_publishes_updates_and_removes_it_then_the_api_follows(string type, string? bodyOption, string? body)
    {
        var name = $"Spring {type}";
        var args = new List<string> { type, "create", "--name", name };
        if (bodyOption is not null)
            args.AddRange(new[] { bodyOption, body! });

        var created = await _host.RunAsync(args.ToArray());
        Assert.Equal(0, created.ExitCode);
        var id = IdIn(created.Output);
        Assert.DoesNotContain(name, await PublishedAsync(type));
        Assert.Matches($@"{id}\s+{name}\s+no", (await _host.RunAsync(type, "list")).Output);

        Assert.Equal(0, (await _host.RunAsync(type, "publish", "--id", id)).ExitCode);
        Assert.Contains(name, await PublishedAsync(type));

        Assert.Equal(0, (await _host.RunAsync(type, "update", "--id", id, "--name", $"{name} (revised)")).ExitCode);
        Assert.Contains($"{name} (revised)", await PublishedAsync(type));

        Assert.Equal(0, (await _host.RunAsync(type, "remove", "--id", id)).ExitCode);
        Assert.DoesNotContain(id, (await _host.RunAsync(type, "list")).Output);
        var missing = await _host.RunAsync(type, "publish", "--id", id);
        Assert.Equal(1, missing.ExitCode);
        Assert.Contains($"No {type} with the id {id}.", missing.Error);
    }

    [Fact]
    public async Task Given_a_notice_body_when_the_operator_updates_only_its_name_then_the_body_is_kept()
    {
        var id = IdIn((await _host.RunAsync("notice", "create", "--name", "Bake sale", "--body", "Saturday at 10 am.", "--publish")).Output);

        await _host.RunAsync("notice", "update", "--id", id, "--name", "Bake sale moved");

        var admin = await _host.CreateClientAsAsync("admin", "Admin123!");
        var notice = (await admin.GetFromJsonAsync<JsonElement>($"/api/notice/{id}")).GetProperty("notice");
        Assert.Equal("Bake sale moved", notice.GetProperty("name").GetString());
        Assert.Equal("Saturday at 10 am.", notice.GetProperty("body").GetString());
    }

    [Fact]
    public async Task Given_a_published_notice_when_the_operator_sends_it_twice_then_each_member_who_asked_gets_one_email()
    {
        using var host = new CliTestHost();
        Assert.Equal(0, (await host.RunAsync("db", "reset", "--demo", "--yes")).ExitCode);
        var id = IdIn((await host.RunAsync("notice", "create", "--name", "Fire drill", "--body", "Thursday at 11 am.", "--publish")).Output);

        var first = await host.RunAsync("notice", "send", "--id", id);
        var second = await host.RunAsync("notice", "send", "--id", id);

        Assert.Equal(0, first.ExitCode);
        Assert.Equal(0, second.ExitCode);
        var email = Assert.Single(host.Notices.Emails, e => e.Subject == "New notice: Fire drill");
        Assert.Equal("rosalind.okafor@coop.test", email.Email);
        Assert.Equal("Thursday at 11 am.", email.Body);
    }

    [Fact]
    public async Task Given_an_unpublished_notice_when_the_operator_sends_it_then_it_is_refused()
    {
        var id = IdIn((await _host.RunAsync("notice", "create", "--name", "Draft notice")).Output);

        var result = await _host.RunAsync("notice", "send", "--id", id);

        Assert.Equal(1, result.ExitCode);
        Assert.Contains("Only a published notice can be sent.", result.Error);
        Assert.DoesNotContain(_host.Notices.Emails, e => e.Subject == "New notice: Draft notice");
    }
}
