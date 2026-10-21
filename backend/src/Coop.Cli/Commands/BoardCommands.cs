using System.CommandLine;

namespace Coop.Cli.Commands;

public static class BoardCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("board", "Export and import the Board of Directors list as JSON");
        return group;
    }
}
