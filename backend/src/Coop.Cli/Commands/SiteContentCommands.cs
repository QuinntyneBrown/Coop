using System.CommandLine;
using Coop.Application.CMS.Dtos;
using Coop.Application.CMS.SiteContent.Commands.DiscardSiteContentDraft;
using Coop.Application.CMS.SiteContent.Commands.PublishSiteContent;
using Coop.Application.CMS.SiteContent.Commands.SaveSiteContent;
using Coop.Application.CMS.SiteContent.Queries.GetSiteContent;
using Coop.Application.CMS.SiteContent.Queries.GetSiteContentDraft;

namespace Coop.Cli.Commands;

/// <summary>
/// The <c>site-content</c> group: the header, footer and home page content as
/// JSON in the API's own contract, so imports pass the API's validators
/// (L2-REQ-108 AC1, AC2), and the draft published, discarded, exported and
/// imported through the same handlers as the admin (L2-REQ-127).
/// </summary>
public static class SiteContentCommands
{
    private const string NoChanges = "There are no unpublished changes.";

    public static Command Create(CliRunner cli)
    {
        var group = new Command("site-content", "Export, import, publish and discard the public site content as JSON");

        var output = new Option<string?>("--file") { Description = "The file to write; the output when left out" };
        var exportDraft = new Option<bool>("--draft") { Description = "Write the unpublished draft when there is one" };
        var export = new Command("export", "Write the published site content, or the draft, as JSON") { output, exportDraft };
        cli.SetAction(export, async context =>
        {
            var content = context.Value(exportDraft)
                ? (await context.SendAsync(new GetSiteContentDraftRequest())).SiteContent
                : (await context.SendAsync(new GetSiteContentRequest())).SiteContent;
            CliFiles.WriteJson(context, context.Value(output), content ?? throw new CliException("There is no published site content."));
        });
        group.Subcommands.Add(export);

        var input = new Option<string>("--file") { Description = "The JSON file to import", Required = true };
        var importDraft = new Option<bool>("--draft") { Description = "Save as the draft without publishing" };
        var import = new Command("import", "Save the site content from a JSON file and publish it, or save it as a draft") { input, importDraft };
        cli.SetAction(import, async context =>
        {
            var content = CliFiles.ReadJson<SiteContentDto>(context.Required(input));
            await context.SendAsync(new SaveSiteContentRequest { SiteContent = content });
            if (context.Value(importDraft))
            {
                context.Output.WriteLine("The site content is saved as a draft. Run site-content publish to publish it.");
                return;
            }
            await context.SendAsync(new PublishSiteContentRequest());
            context.Output.WriteLine("The site content is published.");
        });
        group.Subcommands.Add(import);

        var publish = new Command("publish", "Publish the unpublished changes");
        cli.SetAction(publish, async context =>
        {
            if (!(await context.SendAsync(new GetSiteContentDraftRequest())).HasDraft)
            {
                context.Output.WriteLine(NoChanges);
                return;
            }
            await context.SendAsync(new PublishSiteContentRequest());
            context.Output.WriteLine("The site content is published.");
        });
        group.Subcommands.Add(publish);

        var discard = new Command("discard", "Discard the unpublished changes");
        cli.SetAction(discard, async context =>
        {
            if (!(await context.SendAsync(new GetSiteContentDraftRequest())).HasDraft)
            {
                context.Output.WriteLine(NoChanges);
                return;
            }
            await context.SendAsync(new DiscardSiteContentDraftRequest());
            context.Output.WriteLine("The unpublished changes were discarded.");
        });
        group.Subcommands.Add(discard);

        return group;
    }
}
