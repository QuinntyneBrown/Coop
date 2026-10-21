using System.CommandLine;
using Coop.Application.Identity.Commands.AddUserRole;
using Coop.Application.Identity.Commands.CreateUser;
using Coop.Application.Identity.Commands.RemoveUser;
using Coop.Application.Identity.Commands.RemoveUserRole;
using Coop.Application.Identity.Commands.SetPassword;
using Coop.Application.Identity.Commands.UpdateUser;
using Coop.Application.Identity.Dtos;
using Coop.Application.Identity.Queries.GetUsers;

namespace Coop.Cli.Commands;

/// <summary>The <c>user</c> group (L2-REQ-105). Passwords are never printed.</summary>
public static class UserCommands
{
    public static Command Create(CliRunner cli)
    {
        var group = new Command("user", "List, create, rename, re-password, change roles of and remove users");

        var list = new Command("list", "List users and their roles");
        cli.SetAction(list, async context =>
        {
            var response = await context.SendAsync(new GetUsersRequest());
            Table.Write(context.Output, new[] { "Username", "Roles" },
                response.Users.OrderBy(u => u.Username).Select(u => new[] { u.Username, string.Join(", ", u.Roles.Select(r => r.Name).Order()) }));
        });
        group.Subcommands.Add(list);

        var username = new Option<string>("--username") { Description = "The user's username", Required = true };
        var password = new Option<string>("--password") { Description = "The password; at least 6 characters", Required = true };
        var roles = new Option<string[]>("--role") { Description = "A role to give the user; repeat for more", Arity = ArgumentArity.ZeroOrMore };
        var create = new Command("create", "Create a user") { username, password, roles };
        cli.SetAction(create, async context =>
        {
            var request = new CreateUserRequest { Username = context.Required(username), Password = context.Required(password) };
            foreach (var role in context.Value(roles) ?? Array.Empty<string>())
                request.RoleIds.Add((await Lookup.RoleAsync(context, role)).RoleId);
            var response = await context.SendAsync(request);
            context.Output.WriteLine($"Created user \"{response.User.Username}\" with {RolesText(response.User)}.");
        });
        group.Subcommands.Add(create);

        var newUsername = new Option<string>("--new-username") { Description = "The new username", Required = true };
        var rename = new Command("rename", "Change a user's username") { username, newUsername };
        cli.SetAction(rename, async context =>
        {
            var user = await Lookup.UserAsync(context, context.Required(username));
            var response = await context.SendAsync(new UpdateUserRequest { UserId = user.UserId, Username = context.Required(newUsername) });
            context.Output.WriteLine($"Renamed \"{user.Username}\" to \"{response.User.Username}\".");
        });
        group.Subcommands.Add(rename);

        var setPassword = new Command("set-password", "Set a user's password without the old one") { username, password };
        cli.SetAction(setPassword, async context =>
        {
            var user = await Lookup.UserAsync(context, context.Required(username));
            await context.SendAsync(new SetPasswordRequest { UserId = user.UserId, Password = context.Required(password) });
            context.Output.WriteLine($"Password set for \"{user.Username}\".");
        });
        group.Subcommands.Add(setPassword);

        var role = new Option<string>("--role") { Description = "The role's name", Required = true };
        var addRole = new Command("add-role", "Give a user a role") { username, role };
        cli.SetAction(addRole, async context =>
        {
            var user = await Lookup.UserAsync(context, context.Required(username));
            var found = await Lookup.RoleAsync(context, context.Required(role));
            var response = await context.SendAsync(new AddUserRoleRequest { UserId = user.UserId, RoleId = found.RoleId });
            context.Output.WriteLine($"\"{user.Username}\" now has {RolesText(response.User)}.");
        });
        group.Subcommands.Add(addRole);

        var removeRole = new Command("remove-role", "Take a role from a user") { username, role };
        cli.SetAction(removeRole, async context =>
        {
            var user = await Lookup.UserAsync(context, context.Required(username));
            var found = await Lookup.RoleAsync(context, context.Required(role));
            var response = await context.SendAsync(new RemoveUserRoleRequest { UserId = user.UserId, RoleId = found.RoleId });
            context.Output.WriteLine($"\"{user.Username}\" now has {RolesText(response.User)}.");
        });
        group.Subcommands.Add(removeRole);

        var remove = new Command("remove", "Remove a user; they can no longer sign in") { username };
        cli.SetAction(remove, async context =>
        {
            var user = await Lookup.UserAsync(context, context.Required(username));
            await context.SendAsync(new RemoveUserRequest { UserId = user.UserId });
            context.Output.WriteLine($"Removed user \"{user.Username}\".");
        });
        group.Subcommands.Add(remove);

        return group;
    }

    private static string RolesText(UserDto user)
        => user.Roles.Count == 0 ? "no roles" : $"roles {string.Join(", ", user.Roles.Select(r => r.Name).Order())}";
}
