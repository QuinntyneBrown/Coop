using System.CommandLine;

namespace Coop.Cli.Commands;

public static class SiteContentCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("site-content", "Export and import the public site content as JSON");
        return group;
    }
}
