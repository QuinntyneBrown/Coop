using System.Security.Cryptography;
using Coop.Application.CMS.Dtos;
using Coop.Application.CMS.SiteContent;
using Coop.Domain.Identity;
using Coop.Domain.Onboarding;
using Coop.Domain.Profiles;
using Coop.SharedKernel;
using Microsoft.EntityFrameworkCore;

namespace Coop.Infrastructure.Persistence.Seeding;

/// <summary>
/// The API's startup seed. Each step is safe to re-run; the command-line
/// tool's resets reuse the steps (ADR 0012).
/// </summary>
public static class SeedData
{
    public static async Task SeedAsync(CoopDbContext context, IPasswordHasher passwordHasher)
    {
        // Ensure database created
        await context.Database.EnsureCreatedAsync();

        if (!await context.Roles.IgnoreQueryFilters().AnyAsync())
        {
            await SeedRolesAsync(context);
            await SeedAccountsAsync(context, passwordHasher);
        }

        await SeedPagePrivilegesAsync(context);
        await SeedInvitationsAsync(context);
        await SeedBoardAsync(context);
        await SeedJsonContentAsync(context);
        await SeedSiteContentAsync(context, SiteContentSeed.Create());
        await MigrateHomeSectionsAsync(context);
        await MigratePageBodiesAsync(context);
    }

    /// <summary>
    /// Wraps the HTML body of a page written before blocks existed into one
    /// Existing content block and clears the body, once; a page already in
    /// blocks is left alone (L2-REQ-123 AC4).
    /// </summary>
    public static async Task MigratePageBodiesAsync(CoopDbContext context)
    {
        var pages = await context.Pages.Where(p => p.Body != string.Empty).ToListAsync();
        if (pages.Count == 0) return;
        foreach (var page in pages)
        {
            page.Sections = Coop.Application.CMS.Pages.PageSections.Serialize(Coop.Application.CMS.Pages.PageSections.FromBody(page.Body));
            page.Body = string.Empty;
        }
        await context.SaveChangesAsync();
    }

    /// <summary>The home page kinds in the order the public site showed them before `home.sections` existed.</summary>
    private static readonly string[] HomeSectionKinds = { "hero", "glance", "about", "gallery", "features", "notices", "board", "quote", "visit" };

    /// <summary>
    /// Rewrites a site content or draft entry in the earlier shape (<c>home.hero</c>,
    /// <c>home.glance</c>, …) into <c>home.sections</c> in the default order with
    /// no section hidden, once; an entry already in the new shape is left alone
    /// (L2-REQ-122 AC7, ADR 0021).
    /// </summary>
    public static async Task MigrateHomeSectionsAsync(CoopDbContext context)
    {
        var names = new[] { SiteContentRules.Name, SiteContentRules.DraftName };
        var entries = await context.JsonContents.Where(j => names.Contains(j.Name) && !j.IsDeleted).ToListAsync();
        var changed = false;
        foreach (var entry in entries)
        {
            var migrated = MigrateHomeSections(entry.Json);
            if (migrated is null) continue;
            entry.Json = migrated;
            changed = true;
        }
        if (changed)
            await context.SaveChangesAsync();
    }

    /// <summary>The JSON with <c>home.sections</c> built from the earlier keys, or null when nothing needs to change.</summary>
    public static string? MigrateHomeSections(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return null;
        System.Text.Json.Nodes.JsonNode? root;
        try { root = System.Text.Json.Nodes.JsonNode.Parse(json); }
        catch (System.Text.Json.JsonException) { return null; }
        if (root?["home"] is not System.Text.Json.Nodes.JsonObject home || home["sections"] is System.Text.Json.Nodes.JsonArray)
            return null;

        var sections = new System.Text.Json.Nodes.JsonArray();
        foreach (var kind in HomeSectionKinds)
        {
            if (home[kind] is not System.Text.Json.Nodes.JsonObject section) continue;
            home.Remove(kind);
            var moved = new System.Text.Json.Nodes.JsonObject { ["kind"] = kind };
            foreach (var (key, value) in section.ToList())
            {
                section.Remove(key);
                moved[key] = value;
            }
            sections.Add(moved);
        }
        home["sections"] = sections;
        return root.ToJsonString(new System.Text.Json.JsonSerializerOptions(System.Text.Json.JsonSerializerDefaults.Web));
    }

    /// <summary>The five predefined roles with their privileges (L2-REQ-012), when no role exists.</summary>
    public static async Task SeedRolesAsync(CoopDbContext context)
    {
        if (await context.Roles.IgnoreQueryFilters().AnyAsync())
            return;

        var memberRole = new Role { Name = Constants.Roles.Member };
        var staffRole = new Role { Name = Constants.Roles.Staff };
        var boardMemberRole = new Role { Name = Constants.Roles.BoardMember };
        var sysAdminRole = new Role { Name = Constants.Roles.SystemAdministrator };
        var supportRole = new Role { Name = Constants.Roles.Support };

        // Add full access privileges to SystemAdministrator
        foreach (var aggregate in Constants.Aggregates.All)
        {
            sysAdminRole.AddPrivilege(new Privilege { AccessRight = AccessRight.Delete, Aggregate = aggregate });
        }

        // Add read privileges to Member role
        foreach (var aggregate in Constants.Aggregates.All)
        {
            memberRole.AddPrivilege(new Privilege { AccessRight = AccessRight.Read, Aggregate = aggregate });
        }

        // Add read/write to Staff
        foreach (var aggregate in Constants.Aggregates.All)
        {
            staffRole.AddPrivilege(new Privilege { AccessRight = AccessRight.Write, Aggregate = aggregate });
        }

        // Add read/write/create to BoardMember
        foreach (var aggregate in Constants.Aggregates.All)
        {
            boardMemberRole.AddPrivilege(new Privilege { AccessRight = AccessRight.Create, Aggregate = aggregate });
        }

        // Support gets read/write
        foreach (var aggregate in Constants.Aggregates.All)
        {
            supportRole.AddPrivilege(new Privilege { AccessRight = AccessRight.Write, Aggregate = aggregate });
        }

        context.Roles.AddRange(memberRole, staffRole, boardMemberRole, sysAdminRole, supportRole);
        await context.SaveChangesAsync();
    }

    /// <summary>The <c>admin</c> and <c>member</c> accounts the tests and the demo sign in with.</summary>
    public static async Task SeedAccountsAsync(CoopDbContext context, IPasswordHasher passwordHasher)
    {
        var sysAdminRole = await context.Roles.SingleAsync(r => r.Name == Constants.Roles.SystemAdministrator);
        var memberRole = await context.Roles.SingleAsync(r => r.Name == Constants.Roles.Member);

        // Seed admin user
        var adminSalt = new byte[16];
        RandomNumberGenerator.Fill(adminSalt);
        var adminUser = new User
        {
            Username = "admin",
            Salt = adminSalt,
            Password = passwordHasher.HashPassword(adminSalt, "Admin123!")
        };
        adminUser.Roles.Add(sysAdminRole);
        context.Users.Add(adminUser);

        // Seed member user
        var memberSalt = new byte[16];
        RandomNumberGenerator.Fill(memberSalt);
        var memberUser = new User
        {
            Username = "member",
            Salt = memberSalt,
            Password = passwordHasher.HashPassword(memberSalt, "Member123!")
        };
        memberUser.Roles.Add(memberRole);
        context.Users.Add(memberUser);

        await context.SaveChangesAsync();

        // Seed Member profile for the member user
        var memberProfile = new Member
        {
            UserId = memberUser.UserId,
            Firstname = "Test",
            Lastname = "Member",
            Email = "member@coop.test",
            PhoneNumber = "555-0100",
            UnitNumber = "101",
        };
        context.Members.Add(memberProfile);
        await context.SaveChangesAsync();
    }

    /// <summary>Grants the Page aggregate (added after the first seed) to roles that predate it, at each role's level.</summary>
    public static async Task SeedPagePrivilegesAsync(CoopDbContext context)
    {
        var pageAccess = new Dictionary<string, AccessRight>
        {
            [Constants.Roles.Member] = AccessRight.Read,
            [Constants.Roles.Staff] = AccessRight.Write,
            [Constants.Roles.BoardMember] = AccessRight.Create,
            [Constants.Roles.SystemAdministrator] = AccessRight.Delete,
            [Constants.Roles.Support] = AccessRight.Write,
        };
        var rolesMissingPage = await context.Roles
            .Include(r => r.Privileges)
            .Where(r => r.Privileges.All(p => p.Aggregate != Constants.Aggregates.Page))
            .ToListAsync();
        foreach (var role in rolesMissingPage)
        {
            if (pageAccess.TryGetValue(role.Name, out var accessRight))
                role.AddPrivilege(new Privilege { AccessRight = accessRight, Aggregate = Constants.Aggregates.Page });
        }
        if (rolesMissingPage.Count > 0)
            await context.SaveChangesAsync();
    }

    /// <summary>Seed invitation tokens if none exist.</summary>
    public static async Task SeedInvitationsAsync(CoopDbContext context)
    {
        if (await context.InvitationTokens.AnyAsync())
            return;

        context.InvitationTokens.AddRange(
            new InvitationToken { Value = "valid-invitation-token", Type = InvitationTokenType.Member },
            new InvitationToken { Value = "test-token-e2e", Type = InvitationTokenType.Member }
        );
        await context.SaveChangesAsync();
    }

    /// <summary>Seed board members if none exist.</summary>
    public static async Task SeedBoardAsync(CoopDbContext context)
    {
        if (await context.BoardMembers.AnyAsync())
            return;

        context.BoardMembers.AddRange(
            new BoardMember { Firstname = "Jane", Lastname = "Smith", Email = "jane@coop.test" },
            new BoardMember { Firstname = "John", Lastname = "Doe", Email = "john@coop.test" },
            new BoardMember { Firstname = "Alice", Lastname = "Johnson", Email = "alice@coop.test" }
        );
        await context.SaveChangesAsync();
    }

    /// <summary>Seed JSON content for the landing page.</summary>
    public static async Task SeedJsonContentAsync(CoopDbContext context)
    {
        if (await context.JsonContents.AnyAsync())
            return;

        context.JsonContents.AddRange(
            new Coop.Domain.CMS.JsonContent
            {
                Name = "BoardOfDirectors",
                Json = System.Text.Json.JsonSerializer.Serialize(new
                {
                    members = new[]
                    {
                        new { name = "Jane Smith", role = "President" },
                        new { name = "John Doe", role = "Vice President" },
                        new { name = "Alice Johnson", role = "Secretary" }
                    }
                })
            },
            new Coop.Domain.CMS.JsonContent
            {
                Name = "Landing",
                Json = System.Text.Json.JsonSerializer.Serialize(new
                {
                    title = "Your Community Hub",
                    subtitle = "Everything you need to manage your cooperative."
                })
            }
        );
        await context.SaveChangesAsync();
    }

    /// <summary>Seed the public site content once; an administrator's saved content is kept (L2-REQ-100 AC1).</summary>
    public static async Task SeedSiteContentAsync(CoopDbContext context, SiteContentDto siteContent)
    {
        if (await context.JsonContents.AnyAsync(j => j.Name == SiteContentRules.Name && !j.IsDeleted))
            return;

        context.JsonContents.Add(new Coop.Domain.CMS.JsonContent
        {
            Name = SiteContentRules.Name,
            Json = System.Text.Json.JsonSerializer.Serialize(
                siteContent,
                new System.Text.Json.JsonSerializerOptions(System.Text.Json.JsonSerializerDefaults.Web))
        });
        await context.SaveChangesAsync();
    }
}
