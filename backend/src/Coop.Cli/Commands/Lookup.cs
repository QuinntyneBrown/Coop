using Coop.Application.Identity.Dtos;
using Coop.Application.Identity.Queries.GetUsers;
using Coop.Application.Roles.Queries.GetRoles;

namespace Coop.Cli.Commands;

/// <summary>
/// Finds the record an operator names, through the list queries the API
/// uses, and says plainly when there is none (L2-REQ-102 AC5).
/// </summary>
public static class Lookup
{
    public static async Task<UserDto> UserAsync(CommandContext context, string username)
    {
        var users = await context.SendAsync(new GetUsersRequest());
        return users.Users.SingleOrDefault(u => u.Username == username)
            ?? throw new CliException($"No user named \"{username}\".");
    }

    public static async Task<RoleDto> RoleAsync(CommandContext context, string name)
    {
        var roles = await context.SendAsync(new GetRolesRequest());
        return roles.Roles.SingleOrDefault(r => string.Equals(r.Name, name, StringComparison.OrdinalIgnoreCase))
            ?? throw new CliException($"No role named \"{name}\".");
    }
}
