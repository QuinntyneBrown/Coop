using System.Security.Claims;
using Coop.Application.Common;
using Coop.Application.Common.Interfaces;
using Coop.SharedKernel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging;

/// <summary>
/// Who may use a conversation: the people whose profiles take part in it and
/// the office (Write or higher on the Message aggregate). A member may name
/// only their own profiles, or the empty profile id (L2-REQ-114).
/// </summary>
public static class ConversationAccess
{
    public static Task<bool> IsOfficeAsync(IAuthorizationService authorization, ClaimsPrincipal user)
        => CallerAccess.HoldsWriteAsync(authorization, user, Constants.Aggregates.Message);

    public static async Task<bool> CanUseAsync(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user, Guid conversationId, CancellationToken cancellationToken)
    {
        if (await IsOfficeAsync(authorization, user))
            return true;

        var own = await CallerAccess.OwnProfileIdsAsync(context, user, cancellationToken);
        return await context.Conversations.AnyAsync(c => c.ConversationId == conversationId && c.Profiles.Any(p => own.Contains(p.ProfileId)), cancellationToken);
    }

    public static async Task<bool> CanNameProfileAsync(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user, Guid profileId, CancellationToken cancellationToken)
    {
        if (profileId == Guid.Empty || await IsOfficeAsync(authorization, user))
            return true;

        return (await CallerAccess.OwnProfileIdsAsync(context, user, cancellationToken)).Contains(profileId);
    }
}
