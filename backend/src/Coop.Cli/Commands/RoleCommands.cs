using System.CommandLine;
using Coop.Application.Privileges.Commands.CreatePrivilege;
using Coop.Application.Privileges.Commands.RemovePrivilege;
using Coop.Application.Roles.Commands.CreateRole;
using Coop.Application.Roles.Commands.RemoveRole;
using Coop.Application.Roles.Queries.GetRoles;
using Coop.Domain.Identity;

namespace Coop.Cli.Commands;

/// <summary>The <c>role</c> group: roles and their privileges (L2-REQ-106).</summary>
public static class RoleCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("role", "List, create and remove roles, and grant or revoke privileges");

        var list = new Command("list", "List roles and their privileges as AccessRight:Aggregate");
        cli.SetAction(list, async context =>
        {
            var response = await context.SendAsync(new GetRolesRequest());
            Table.Write(context.Output, new[] { "Role", "Privileges" },
                response.Roles.OrderBy(r => r.Name).Select(r => new[]
                {
                    r.Name,
                    string.Join(", ", r.Privileges.OrderBy(p => p.Aggregate).ThenBy(p => p.AccessRight).Select(p => $"{p.AccessRight}:{p.Aggregate}")),
                }));
        });
        group.Subcommands.Add(list);

        var name = new Option<string>("--name") { Description = "The role's name", Required = true };
        var create = new Command("create", "Create a role, or return the one with this name") { name };
        cli.SetAction(create, async context =>
        {
            var response = await context.SendAsync(new CreateRoleRequest { Name = context.Required(name) });
            context.Output.WriteLine($"Role \"{response.Role.Name}\" exists.");
        });
        group.Subcommands.Add(create);

        var remove = new Command("remove", "Remove a role and its privileges; users no longer hold it") { name };
        cli.SetAction(remove, async context =>
        {
            var role = await Lookup.RoleAsync(context, context.Required(name));
            await context.SendAsync(new RemoveRoleRequest { RoleId = role.RoleId });
            context.Output.WriteLine($"Removed role \"{role.Name}\".");
        });
        group.Subcommands.Add(remove);

        var roleName = new Option<string>("--role") { Description = "The role's name", Required = true };
        var aggregate = new Option<string>("--aggregate") { Description = "The aggregate, for example Notice or Page", Required = true };
        var access = new Option<AccessRight>("--access") { Description = "Read, Write, Create or Delete", Required = true };

        var grant = new Command("grant", "Grant a role a privilege on an aggregate") { roleName, aggregate, access };
        cli.SetAction(grant, async context =>
        {
            var role = await Lookup.RoleAsync(context, context.Required(roleName));
            var response = await context.SendAsync(new CreatePrivilegeRequest
            {
                RoleId = role.RoleId,
                Aggregate = context.Required(aggregate),
                AccessRight = context.Required(access),
            });
            context.Output.WriteLine($"\"{role.Name}\" has {response.Privilege.AccessRight}:{response.Privilege.Aggregate}.");
        });
        group.Subcommands.Add(grant);

        var revoke = new Command("revoke", "Revoke a privilege from a role") { roleName, aggregate, access };
        cli.SetAction(revoke, async context =>
        {
            var role = await Lookup.RoleAsync(context, context.Required(roleName));
            var right = context.Required(access);
            var target = context.Required(aggregate);
            var privilege = role.Privileges.FirstOrDefault(p => p.AccessRight == right && string.Equals(p.Aggregate, target, StringComparison.OrdinalIgnoreCase))
                ?? throw new CliException($"The role \"{role.Name}\" has no {right} privilege on {target}.");
            await context.SendAsync(new RemovePrivilegeRequest { PrivilegeId = privilege.PrivilegeId });
            context.Output.WriteLine($"\"{role.Name}\" no longer has {right}:{privilege.Aggregate}.");
        });
        group.Subcommands.Add(revoke);

        return group;
    }
}
