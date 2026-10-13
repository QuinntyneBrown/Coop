using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Domain.Authorization;
using Coop.Domain.Maintenance;
using Coop.SharedKernel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance;

/// <summary>
/// Who may see a maintenance request's private data: the household that
/// asked for it (the user owning the requesting profile) and the office
/// (Write or higher on the MaintenanceRequest aggregate).
/// </summary>
public static class MaintenanceRequestAccess
{
    public static async Task<bool> IsHouseholdAsync(ICoopDbContext context, ClaimsPrincipal user, MaintenanceRequest request, CancellationToken cancellationToken)
    {
        var claim = user.FindFirst(Constants.ClaimTypes.UserId);
        if (claim is null || !Guid.TryParse(claim.Value, out var userId))
            return false;

        return await context.Profiles.AnyAsync(p => p.ProfileId == request.RequestedByProfileId && p.UserId == userId, cancellationToken);
    }

    public static async Task<bool> CanReadAsync(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user, MaintenanceRequest request, CancellationToken cancellationToken)
    {
        if (await IsHouseholdAsync(context, user, request, cancellationToken))
            return true;

        var office = await authorization.AuthorizeAsync(user, Constants.Aggregates.MaintenanceRequest, Operations.Write);
        return office.Succeeded;
    }
}
