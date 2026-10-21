using System.CommandLine;
using Coop.Cli.Commands;
using Microsoft.Extensions.DependencyInjection;

namespace Coop.Cli;

/// <summary>
/// Builds the command tree, parses the arguments and runs the chosen command
/// (L2-REQ-102). Output and errors go to the given writers, so tests can run
/// the tool in process.
/// </summary>
public static class CliApp
{
    public static async Task<int> RunAsync(string[] args, TextWriter output, TextWriter error, Action<IServiceCollection>? configureServices = null)
    {
        var connection = new Option<string?>("--connection")
        {
            Description = "Database connection string; defaults to ConnectionStrings:DefaultConnection, as the API",
            Recursive = true,
        };
        var cli = new CliRunner(output, error, connection, configureServices);

        var root = new RootCommand("Coop command-line administration: reset the database and manage users, roles, invitations and the public site content.");
        root.Options.Add(connection);
        root.Subcommands.Add(DbCommands.Create(cli));
        root.Subcommands.Add(UserCommands.Create(cli));
        root.Subcommands.Add(RoleCommands.Create(cli));
        root.Subcommands.Add(InvitationCommands.Create(cli));
        root.Subcommands.Add(SiteContentCommands.Create(cli));
        root.Subcommands.Add(PageCommands.Create(cli));
        root.Subcommands.Add(BoardCommands.Create(cli));
        root.Subcommands.Add(AssetCommands.Create(cli));
        root.Subcommands.Add(ThemeCommands.Create(cli));
        root.Subcommands.Add(DocumentCommands.CreateNotices(cli));
        root.Subcommands.Add(DocumentCommands.CreateByLaws(cli));
        root.Subcommands.Add(DocumentCommands.CreateReports(cli));

        var parseResult = root.Parse(args);
        return await parseResult.InvokeAsync(new InvocationConfiguration { Output = output, Error = error });
    }
}
