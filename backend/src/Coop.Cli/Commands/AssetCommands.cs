using System.CommandLine;

namespace Coop.Cli.Commands;

public static class AssetCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("asset", "List, upload and remove digital assets");
        return group;
    }
}
