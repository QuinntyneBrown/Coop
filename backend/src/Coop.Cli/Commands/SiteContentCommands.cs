using System.CommandLine;
using Coop.Application.CMS.Dtos;
using Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;
using Coop.Application.CMS.SiteContent.Queries.GetSiteContent;

namespace Coop.Cli.Commands;

/// <summary>
/// The <c>site-content</c> group: the header, footer and home page content as
/// JSON in the API's own contract, so imports pass the API's validators
/// (L2-REQ-108 AC1, AC2).
/// </summary>
public static class SiteContentCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("site-content", "Export and import the public site content as JSON");

        var output = new Option<string?>("--file") { Description = "The file to write; the output when left out" };
        var export = new Command("export", "Write the published site content as JSON") { output };
        cli.SetAction(export, async context =>
        {
            var response = await context.SendAsync(new GetSiteContentRequest());
            var content = response.SiteContent ?? throw new CliException("There is no published site content.");
            CliFiles.WriteJson(context, context.Value(output), content);
        });
        group.Subcommands.Add(export);

        var input = new Option<string>("--file") { Description = "The JSON file to publish", Required = true };
        var import = new Command("import", "Publish the site content from a JSON file") { input };
        cli.SetAction(import, async context =>
        {
            var content = CliFiles.ReadJson<SiteContentDto>(context.Required(input));
            await context.SendAsync(new SaveSiteContentRequest { SiteContent = content });
            context.Output.WriteLine("The site content is published.");
        });
        group.Subcommands.Add(import);

        return group;
    }
}
