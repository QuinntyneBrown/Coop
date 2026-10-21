using System.CommandLine;

namespace Coop.Cli.Commands;

public static class DbCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("db", "Reset the database to the demo state or a new instance");
        return group;
    }
}
