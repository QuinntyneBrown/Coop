using System.CommandLine;

namespace Coop.Cli.Commands;

public static class UserCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("user", "List, create, rename, re-password, change roles of and remove users");
        return group;
    }
}
