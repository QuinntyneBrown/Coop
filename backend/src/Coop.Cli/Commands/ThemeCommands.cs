using System.CommandLine;

namespace Coop.Cli.Commands;

public static class ThemeCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("theme", "List, create, update and remove themes");
        return group;
    }
}
