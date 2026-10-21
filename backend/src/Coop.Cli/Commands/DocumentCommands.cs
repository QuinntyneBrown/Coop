using System.CommandLine;

namespace Coop.Cli.Commands;

public static class DocumentCommands
{
    public static Command CreateNotices(CliRunner cli) => new("notice", "List, create, update, publish, remove and send notices");

    public static Command CreateByLaws(CliRunner cli) => new("bylaw", "List, create, update, publish and remove bylaws");

    public static Command CreateReports(CliRunner cli) => new("report", "List, create, update, publish and remove reports");
}
