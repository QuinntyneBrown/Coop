using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Domain.Authorization;
using Coop.SharedKernel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Common;

/// <summary>
/// What the API knows about the signed-in caller: their user, the profiles
/// they own, whether they are the office (an office role, ADR 0012) and
/// whether they hold Write on an aggregate (the office for a record).
/// </summary>
public static class CallerAccess
{
    public static Guid? UserId(ClaimsPrincipal user)
    {
        var claim = user.FindFirst(Constants.ClaimTypes.UserId);
        return claim is not null && Guid.TryParse(claim.Value, out var userId) ? userId : null;
    }

    public static bool IsOffice(ClaimsPrincipal user)
        => user.Claims
            .Where(c => c.Type == Constants.ClaimTypes.Role || c.Type == "role")
            .Any(c => Constants.Roles.Office.Contains(c.Value));

    public static async Task<List<Guid>> OwnProfileIdsAsync(ICoopDbContext context, ClaimsPrincipal user, CancellationToken cancellationToken)
    {
        var userId = UserId(user);
        if (userId is null)
            return new List<Guid>();

        return await context.Profiles
            .Where(p => p.UserId == userId && !p.IsDeleted)
            .Select(p => p.ProfileId)
            .ToListAsync(cancellationToken);
    }

    public static async Task<bool> HoldsWriteAsync(IAuthorizationService authorization, ClaimsPrincipal user, string aggregate)
        => (await authorization.AuthorizeAsync(user, aggregate, Operations.Write)).Succeeded;
}
