using System.CommandLine;

namespace Coop.Cli.Commands;

public static class RoleCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("role", "List, create and remove roles, and grant or revoke privileges");
        return group;
    }
}
