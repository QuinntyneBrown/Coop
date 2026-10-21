using System.CommandLine;

namespace Coop.Cli.Commands;

public static class InvitationCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("invitation", "List, create and remove invitation tokens");
        return group;
    }
}
