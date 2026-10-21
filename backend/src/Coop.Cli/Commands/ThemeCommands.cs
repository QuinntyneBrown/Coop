using System.CommandLine;
using Coop.Application.CMS.Dtos;
using Coop.Application.CMS.Themes.Commands.CreateTheme;
using Coop.Application.CMS.Themes.Commands.RemoveTheme;
using Coop.Application.CMS.Themes.Commands.UpdateTheme;
using Coop.Application.CMS.Themes.Queries.GetThemes;

namespace Coop.Cli.Commands;

/// <summary>
/// The <c>theme</c> group (L2-REQ-108 AC6, L2-REQ-045). A theme's CSS custom
/// properties are declarations such as <c>--primary-color: #3D8A5A</c>, read
/// from a file because they start with dashes.
/// </summary>
public static class ThemeCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("theme", "List, create, update and remove themes");

        var list = new Command("list", "List themes");
        cli.SetAction(list, async context =>
        {
            var response = await context.SendAsync(new GetThemesRequest());
            Table.Write(context.Output, new[] { "Id", "Default", "CSS custom properties" },
                response.Themes.Select(t => new[] { t.ThemeId.ToString(), t.IsDefault ? "yes" : "no", t.CssCustomProperties }));
        });
        group.Subcommands.Add(list);

        var cssFile = new Option<string>("--css-file") { Description = "A file holding the CSS custom property declarations", Required = true };
        var isDefault = new Option<bool>("--default") { Description = "Make it the default theme" };
        var create = new Command("create", "Create a theme") { cssFile, isDefault };
        cli.SetAction(create, async context =>
        {
            var response = await context.SendAsync(new CreateThemeRequest
            {
                CssCustomProperties = CliFiles.ReadText(context.Required(cssFile)).Trim(),
                IsDefault = context.Value(isDefault),
            });
            context.Output.WriteLine($"Created theme {response.Theme.ThemeId}.");
        });
        group.Subcommands.Add(create);

        var id = new Option<Guid>("--id") { Description = "The theme's id", Required = true };
        var update = new Command("update", "Replace a theme's declarations") { id, cssFile, isDefault };
        cli.SetAction(update, async context =>
        {
            var theme = await FindAsync(context, context.Required(id));
            await context.SendAsync(new UpdateThemeRequest
            {
                ThemeId = theme.ThemeId,
                CssCustomProperties = CliFiles.ReadText(context.Required(cssFile)).Trim(),
                IsDefault = context.Value(isDefault),
            });
            context.Output.WriteLine($"Updated theme {theme.ThemeId}.");
        });
        group.Subcommands.Add(update);

        var remove = new Command("remove", "Remove a theme") { id };
        cli.SetAction(remove, async context =>
        {
            var theme = await FindAsync(context, context.Required(id));
            await context.SendAsync(new RemoveThemeRequest { ThemeId = theme.ThemeId });
            context.Output.WriteLine($"Removed theme {theme.ThemeId}.");
        });
        group.Subcommands.Add(remove);

        return group;
    }

    private static async Task<ThemeDto> FindAsync(CommandContext context, Guid id)
    {
        var themes = await context.SendAsync(new GetThemesRequest());
        return themes.Themes.FirstOrDefault(t => t.ThemeId == id) ?? throw new CliException($"No theme with the id {id}.");
    }
}
