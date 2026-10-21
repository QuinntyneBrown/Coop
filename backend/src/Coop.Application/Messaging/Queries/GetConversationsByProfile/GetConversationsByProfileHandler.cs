using System.Security.Claims;
using Coop.Application.Common;
using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Queries.GetConversationsByProfile;

public class GetConversationsByProfileHandler : IRequestHandler<GetConversationsByProfileRequest, GetConversationsByProfileResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;
    public GetConversationsByProfileHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user) { _context = context; _authorization = authorization; _user = user; }

    public async Task<GetConversationsByProfileResponse> Handle(GetConversationsByProfileRequest request, CancellationToken cancellationToken)
    {
        var convos = _context.Conversations.Include(c => c.Messages).Include(c => c.Profiles).Where(c => !c.IsDeleted);
        if (request.ProfileId != Guid.Empty)
        {
            if (!await ConversationAccess.CanNameProfileAsync(_context, _authorization, _user, request.ProfileId, cancellationToken))
                throw new UnauthorizedAccessException("Access denied.");
            convos = convos.Where(c => c.Profiles.Any(p => p.ProfileId == request.ProfileId));
        }
        else if (!await ConversationAccess.IsOfficeAsync(_authorization, _user))
        {
            // The empty profile id means every conversation the caller takes part in; the office sees them all.
            var own = await CallerAccess.OwnProfileIdsAsync(_context, _user, cancellationToken);
            convos = convos.Where(c => c.Profiles.Any(p => own.Contains(p.ProfileId)));
        }
        var list = await convos.ToListAsync(cancellationToken);
        return new GetConversationsByProfileResponse { Conversations = list.Select(ConversationDto.FromConversation).ToList() };
    }
}
