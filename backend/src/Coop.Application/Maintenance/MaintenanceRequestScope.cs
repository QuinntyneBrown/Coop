using System.Security.Claims;
using Coop.Application.Common;
using Coop.Application.Common.Interfaces;
using Coop.SharedKernel;
using Microsoft.AspNetCore.Authorization;

namespace Coop.Application.Maintenance;

/// <summary>
/// Which requesting profiles a caller may see in a list: null for the office
/// (Write or higher on MaintenanceRequest), otherwise the caller's own
/// profiles (L2-REQ-106).
/// </summary>
public static class MaintenanceRequestScope
{
    public static async Task<List<Guid>?> VisibleProfileIdsAsync(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user, CancellationToken cancellationToken)
    {
        if (await CallerAccess.HoldsWriteAsync(authorization, user, Constants.Aggregates.MaintenanceRequest))
            return null;

        return await CallerAccess.OwnProfileIdsAsync(context, user, cancellationToken);
    }
}
