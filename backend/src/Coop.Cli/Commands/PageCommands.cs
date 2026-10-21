using System.CommandLine;
using Coop.Application.CMS.Dtos;
using Coop.Application.CMS.Pages.Commands.CreatePage;
using Coop.Application.CMS.Pages.Commands.RemovePage;
using Coop.Application.CMS.Pages.Commands.UpdatePage;
using Coop.Application.CMS.Pages.Queries.GetPageBySlug;
using Coop.Application.CMS.Pages.Queries.GetPages;

namespace Coop.Cli.Commands;

/// <summary>The <c>page</c> group: website pages (L2-REQ-108 AC3, L2-REQ-080).</summary>
public static class PageCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("page", "List, create, update and remove website pages");

        var list = new Command("list", "List website pages, oldest first");
        cli.SetAction(list, async context =>
        {
            var response = await context.SendAsync(new GetPagesRequest());
            Table.Write(context.Output, new[] { "Address", "Title", "Id" },
                response.Pages.Select(p => new[] { $"/pages/{p.Slug}", p.Title, p.PageId.ToString() }));
        });
        group.Subcommands.Add(list);

        // Create needs a title and a body; update keeps the page's own when they are left out.
        var title = new Option<string>("--title") { Description = "The page title; it gives the page its address", Required = true };
        var bodyFile = new Option<string>("--body-file") { Description = "A file holding the page text as simple HTML", Required = true };
        var newTitle = new Option<string?>("--title") { Description = "The new page title" };
        var newBodyFile = new Option<string?>("--body-file") { Description = "A file holding the new page text as simple HTML" };
        var heroImageUrl = new Option<string?>("--hero-image-url") { Description = "The hero photo's address, for example from asset upload; empty removes it" };
        var heroImageAlt = new Option<string?>("--hero-image-alt") { Description = "The hero photo's description for people who cannot see it" };

        var create = new Command("create", "Create a page, or return the one with this title's address")
        {
            title, bodyFile, heroImageUrl, heroImageAlt,
        };
        cli.SetAction(create, async context =>
        {
            var response = await context.SendAsync(new CreatePageRequest
            {
                Title = context.Required(title),
                Body = CliFiles.ReadText(context.Required(bodyFile)),
                HeroImageUrl = Optional(context.Value(heroImageUrl)),
                HeroImageAlt = Optional(context.Value(heroImageAlt)),
            });
            WritePage(context, response.Page);
        });
        group.Subcommands.Add(create);

        var slug = new Option<string>("--slug") { Description = "The page's address after /pages/", Required = true };
        var update = new Command("update", "Change a page; options left out keep their values")
        {
            slug, newTitle, newBodyFile, heroImageUrl, heroImageAlt,
        };
        cli.SetAction(update, async context =>
        {
            var page = await FindAsync(context, context.Required(slug));
            var newUrl = context.ParseResult.GetResult(heroImageUrl) is null ? page.HeroImageUrl : Optional(context.Value(heroImageUrl));
            var newAlt = context.ParseResult.GetResult(heroImageAlt) is null ? page.HeroImageAlt : Optional(context.Value(heroImageAlt));
            var response = await context.SendAsync(new UpdatePageRequest
            {
                PageId = page.PageId,
                Title = context.Value(newTitle) ?? page.Title,
                Body = context.Value(newBodyFile) is string path ? CliFiles.ReadText(path) : page.Body,
                HeroImageUrl = newUrl,
                HeroImageAlt = newUrl is null ? null : newAlt,
            });
            WritePage(context, response.Page);
        });
        group.Subcommands.Add(update);

        var remove = new Command("remove", "Remove a page from the website") { slug };
        cli.SetAction(remove, async context =>
        {
            var page = await FindAsync(context, context.Required(slug));
            await context.SendAsync(new RemovePageRequest { PageId = page.PageId });
            context.Output.WriteLine($"Removed \"{page.Title}\" from /pages/{page.Slug}.");
        });
        group.Subcommands.Add(remove);

        return group;
    }

    private static async Task<PageDto> FindAsync(CommandContext context, string slug)
    {
        var response = await context.SendAsync(new GetPageBySlugRequest { Slug = slug });
        return response.Page ?? throw new CliException($"No page at /pages/{slug}.");
    }

    private static string? Optional(string? value) => string.IsNullOrWhiteSpace(value) ? null : value;

    private static void WritePage(CommandContext context, PageDto page)
        => context.Output.WriteLine($"\"{page.Title}\" is at /pages/{page.Slug} ({page.PageId}).");
}
