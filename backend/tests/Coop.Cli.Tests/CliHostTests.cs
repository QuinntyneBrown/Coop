// Acceptance Test
// Traces to: L2-REQ-102
// Description: The tool's command tree, help, exit codes and plain errors.

namespace Coop.Cli.Tests;

public class CliHostTests : IClassFixture<CliTestHost>
{
    private readonly CliTestHost _host;

    public CliHostTests(CliTestHost host) => _host = host;

    [Fact]
    public async Task Given_help_when_the_tool_runs_then_it_lists_every_command_group_and_exits_with_0()
    {
        var result = await _host.RunAsync("--help");

        Assert.Equal(0, result.ExitCode);
        foreach (var group in new[] { "db", "user", "role", "invitation", "site-content", "page", "board", "asset", "theme", "notice", "bylaw", "report" })
            Assert.Contains($"  {group} ", result.Output);
        Assert.Contains("--connection", result.Output);
    }

    [Fact]
    public async Task Given_an_unknown_command_when_the_tool_runs_then_it_explains_and_exits_with_a_non_zero_code()
    {
        var result = await _host.RunAsync("frobnicate");

        Assert.NotEqual(0, result.ExitCode);
        Assert.Contains("frobnicate", result.Error);
    }
}
