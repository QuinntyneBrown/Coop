using Coop.Application.Common.Interfaces;
using Coop.SharedKernel;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity;

/// <summary>
/// An installation keeps at least one active user with the SystemAdministrator
/// role, so someone can always administer it (L2-REQ-105 AC8).
/// </summary>
public static class SystemAdministratorRules
{
    public const string LastAdministratorMessage = "At least one system administrator must remain.";

    /// <summary>True when the user does not hold the role, or another active user does.</summary>
    public static async Task<bool> AnotherRemainsWithoutAsync(ICoopDbContext context, Guid userId, CancellationToken cancellationToken)
    {
        var holds = await context.Users.AnyAsync(u => u.UserId == userId
            && u.Roles.Any(r => r.Name == Constants.Roles.SystemAdministrator), cancellationToken);
        return !holds || await context.Users.AnyAsync(u => u.UserId != userId && !u.IsDeleted
            && u.Roles.Any(r => r.Name == Constants.Roles.SystemAdministrator), cancellationToken);
    }

    public static Task<bool> IsSystemAdministratorRoleAsync(ICoopDbContext context, Guid roleId, CancellationToken cancellationToken)
        => context.Roles.AnyAsync(r => r.RoleId == roleId && r.Name == Constants.Roles.SystemAdministrator, cancellationToken);
}
