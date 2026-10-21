using System.CommandLine;
using Coop.Application.CMS.Board.Commands.SaveBoardOfDirectors;
using Coop.Application.CMS.Board.Queries.GetBoardOfDirectors;
using Coop.Application.CMS.Dtos;

namespace Coop.Cli.Commands;

/// <summary>The <c>board</c> group: the Board of Directors list as a JSON array of name, title and photoUrl (L2-REQ-108 AC4).</summary>
public static class BoardCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("board", "Export and import the Board of Directors list as JSON");

        var output = new Option<string?>("--file") { Description = "The file to write; the output when left out" };
        var export = new Command("export", "Write the directors, in order, as JSON") { output };
        cli.SetAction(export, async context =>
        {
            var response = await context.SendAsync(new GetBoardOfDirectorsRequest());
            CliFiles.WriteJson(context, context.Value(output), response.Directors);
        });
        group.Subcommands.Add(export);

        var input = new Option<string>("--file") { Description = "The JSON file of directors, in order", Required = true };
        var import = new Command("import", "Replace the board list from a JSON file") { input };
        cli.SetAction(import, async context =>
        {
            var directors = CliFiles.ReadJson<List<DirectorDto>>(context.Required(input));
            var response = await context.SendAsync(new SaveBoardOfDirectorsRequest { Directors = directors });
            context.Output.WriteLine($"The board list now has {response.Directors.Count} directors.");
        });
        group.Subcommands.Add(import);

        return group;
    }
}
