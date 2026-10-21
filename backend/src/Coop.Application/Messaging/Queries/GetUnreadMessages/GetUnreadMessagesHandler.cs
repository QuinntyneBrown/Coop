using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Queries.GetUnreadMessages;

public class GetUnreadMessagesHandler : IRequestHandler<GetUnreadMessagesRequest, GetUnreadMessagesResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;
    public GetUnreadMessagesHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user) { _context = context; _authorization = authorization; _user = user; }

    public async Task<GetUnreadMessagesResponse> Handle(GetUnreadMessagesRequest request, CancellationToken cancellationToken)
    {
        if (!await ConversationAccess.CanNameProfileAsync(_context, _authorization, _user, request.ProfileId, cancellationToken))
            throw new UnauthorizedAccessException("Access denied.");
        var msgs = await _context.Messages.Where(m => m.ToProfileId == request.ProfileId && !m.Read && !m.IsDeleted).ToListAsync(cancellationToken);
        return new GetUnreadMessagesResponse { Messages = msgs.Select(MessageDto.FromMessage).ToList() };
    }
}
