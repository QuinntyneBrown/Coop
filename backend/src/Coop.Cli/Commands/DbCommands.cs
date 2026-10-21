using System.CommandLine;
using Coop.Application.Identity;
using Coop.Application.Identity.Commands.CreateUser;
using Coop.Cli.Seeding;
using Coop.Domain.Identity;
using Coop.Infrastructure.Persistence;
using Coop.Infrastructure.Persistence.Seeding;
using Coop.SharedKernel;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Coop.Cli.Commands;

/// <summary>
/// <c>db reset</c>: deletes the database and creates it again as the demo
/// state (L2-REQ-103) or a new instance (L2-REQ-104).
/// </summary>
public static class DbCommands
{
    public const string ConfirmMessage = "This deletes every record in the database. Add --yes to confirm.";

    public static Command Create(CliRunner cli)
    {
        var demo = new Option<bool>("--demo") { Description = "One sign-in per role and fictional content for every screen" };
        var apiUrl = new Option<string>("--api-url")
        {
            Description = "The API address the demo photos are served from",
            DefaultValueFactory = _ => DemoSeed.DefaultApiUrl,
        };
        var newInstance = new Option<bool>("--new-instance") { Description = "Roles, privileges, one administrator and the baseline site content only" };
        var adminUsername = new Option<string?>("--admin-username") { Description = "The new instance's administrator username" };
        var adminPassword = new Option<string?>("--admin-password") { Description = "The new instance's administrator password" };
        var yes = new Option<bool>("--yes") { Description = "Confirm that every record in the database is deleted" };

        var reset = new Command("reset", "Delete the database and create it again")
        {
            demo, apiUrl, newInstance, adminUsername, adminPassword, yes,
        };
        cli.SetAction(reset, async context =>
        {
            if (context.Value(demo) == context.Value(newInstance))
                throw new CliException("Choose either --demo or --new-instance.");
            if (context.Value(demo))
            {
                if (!context.Value(yes))
                    throw new CliException(ConfirmMessage);
                var demoDb = context.Services.GetRequiredService<CoopDbContext>();
                await RecreateAsync(demoDb);
                await SeedData.SeedAsync(demoDb, context.Services.GetRequiredService<IPasswordHasher>());
                await DemoSeed.SeedAsync(demoDb, context.Services.GetRequiredService<IPasswordHasher>(), context.Required(apiUrl));
                context.Output.WriteLine("The database now holds the demo state. Sign in as admin, member, staff, board or support; the passwords are in backend/README.md.");
                return;
            }

            var administrator = new CreateUserRequest
            {
                Username = context.Value(adminUsername) ?? throw new CliException("--admin-username is required with --new-instance."),
                Password = context.Value(adminPassword) ?? throw new CliException("--admin-password is required with --new-instance."),
            };
            if (!context.Value(yes))
                throw new CliException(ConfirmMessage);

            // Check the administrator against the API's credential rules before anything is deleted (L2-REQ-104 AC3).
            var credentials = new InlineValidator<CreateUserRequest>();
            credentials.RuleFor(x => x.Username).Username();
            credentials.RuleFor(x => x.Password).Password();
            await credentials.ValidateAndThrowAsync(administrator, context.CancellationToken);

            var db = context.Services.GetRequiredService<CoopDbContext>();
            await RecreateAsync(db);
            await SeedData.SeedRolesAsync(db);
            administrator.RoleIds.Add(await db.Roles
                .Where(r => r.Name == Constants.Roles.SystemAdministrator)
                .Select(r => r.RoleId)
                .SingleAsync(context.CancellationToken));
            await context.SendAsync(administrator);
            await SeedData.SeedSiteContentAsync(db, SiteContentSeed.Create());

            context.Output.WriteLine($"The database is now a new instance. Sign in as \"{administrator.Username}\" with the password you chose.");
        });

        return new Command("db", "Reset the database to the demo state or a new instance") { reset };
    }

    /// <summary>Deletes the database and creates the schema the way the API does, with no migrations (ADR 0012).</summary>
    private static async Task RecreateAsync(CoopDbContext db)
    {
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();
    }
}
