using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Queries.GetMessagesByConversation;

public class GetMessagesByConversationHandler : IRequestHandler<GetMessagesByConversationRequest, GetMessagesByConversationResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;
    public GetMessagesByConversationHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user) { _context = context; _authorization = authorization; _user = user; }

    public async Task<GetMessagesByConversationResponse> Handle(GetMessagesByConversationRequest request, CancellationToken cancellationToken)
    {
        if (!await ConversationAccess.CanUseAsync(_context, _authorization, _user, request.ConversationId, cancellationToken))
            throw new UnauthorizedAccessException("Access denied.");
        var msgs = await _context.Messages.Where(m => m.ConversationId == request.ConversationId && !m.IsDeleted).OrderBy(m => m.CreatedOn).ToListAsync(cancellationToken);
        return new GetMessagesByConversationResponse { Messages = msgs.Select(MessageDto.FromMessage).ToList() };
    }
}
