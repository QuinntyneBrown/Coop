using System.CommandLine;

namespace Coop.Cli.Commands;

public static class PageCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("page", "List, create, update and remove website pages");
        return group;
    }
}
