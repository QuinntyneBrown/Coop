using System.Security.Claims;
using Coop.Domain.Authorization;
using Coop.Domain.Profiles;
using Coop.SharedKernel;
using Microsoft.AspNetCore.Authorization;

namespace Coop.Application.Profiles;

/// <summary>
/// Who may change a profile's picture: the user who owns the profile and the
/// office (Write or higher on the Member aggregate).
/// </summary>
public static class ProfileAccess
{
    /// <summary>The office for profiles: Write or higher on the Member aggregate.</summary>
    public static async Task<bool> IsOfficeAsync(IAuthorizationService authorization, ClaimsPrincipal user)
        => (await authorization.AuthorizeAsync(user, Constants.Aggregates.Member, Operations.Write)).Succeeded;

    public static async Task<bool> CanChangePictureAsync(IAuthorizationService authorization, ClaimsPrincipal user, ProfileBase profile)
    {
        var claim = user.FindFirst(Constants.ClaimTypes.UserId);
        if (claim is not null && Guid.TryParse(claim.Value, out var userId) && profile.UserId == userId)
            return true;

        var office = await authorization.AuthorizeAsync(user, Constants.Aggregates.Member, Operations.Write);
        return office.Succeeded;
    }
}
