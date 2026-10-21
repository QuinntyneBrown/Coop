using System.Security.Claims;
using Coop.Application.Common;
using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Queries.GetConversationBetween;

public class GetConversationBetweenHandler : IRequestHandler<GetConversationBetweenRequest, GetConversationBetweenResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;
    public GetConversationBetweenHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user) { _context = context; _authorization = authorization; _user = user; }

    public async Task<GetConversationBetweenResponse> Handle(GetConversationBetweenRequest request, CancellationToken cancellationToken)
    {
        if (!await ConversationAccess.IsOfficeAsync(_authorization, _user))
        {
            var own = await CallerAccess.OwnProfileIdsAsync(_context, _user, cancellationToken);
            if (!own.Contains(request.ProfileIdA) && !own.Contains(request.ProfileIdB))
                throw new UnauthorizedAccessException("Access denied.");
        }
        var c = await _context.Conversations.Include(c => c.Messages).Include(c => c.Profiles).FirstOrDefaultAsync(c => c.Profiles.Any(p => p.ProfileId == request.ProfileIdA) && c.Profiles.Any(p => p.ProfileId == request.ProfileIdB) && !c.IsDeleted, cancellationToken);
        return new GetConversationBetweenResponse { Conversation = c != null ? ConversationDto.FromConversation(c) : null };
    }
}
