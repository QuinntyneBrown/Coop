using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Queries.GetUnreadMessageCount;

public class GetUnreadMessageCountHandler : IRequestHandler<GetUnreadMessageCountRequest, GetUnreadMessageCountResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;
    public GetUnreadMessageCountHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user) { _context = context; _authorization = authorization; _user = user; }

    public async Task<GetUnreadMessageCountResponse> Handle(GetUnreadMessageCountRequest request, CancellationToken cancellationToken)
    {
        if (!await ConversationAccess.CanNameProfileAsync(_context, _authorization, _user, request.ProfileId, cancellationToken))
            throw new UnauthorizedAccessException("Access denied.");
        var count = await _context.Messages.CountAsync(m => m.ToProfileId == request.ProfileId && !m.Read && !m.IsDeleted, cancellationToken);
        return new GetUnreadMessageCountResponse { Count = count };
    }
}
