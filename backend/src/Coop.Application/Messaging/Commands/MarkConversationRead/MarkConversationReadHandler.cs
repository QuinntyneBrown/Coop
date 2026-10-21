using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using Coop.Domain.Messaging;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Commands.MarkConversationRead;

public class MarkConversationReadHandler : IRequestHandler<MarkConversationReadRequest, MarkConversationReadResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;
    public MarkConversationReadHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user) { _context = context; _authorization = authorization; _user = user; }

    public async Task<MarkConversationReadResponse> Handle(MarkConversationReadRequest request, CancellationToken cancellationToken)
    {
        if (!await ConversationAccess.CanNameProfileAsync(_context, _authorization, _user, request.ProfileId, cancellationToken)
            || !await ConversationAccess.CanUseAsync(_context, _authorization, _user, request.ConversationId, cancellationToken))
            throw new UnauthorizedAccessException("Access denied.");
        var messages = await _context.Messages.Where(m => m.ConversationId == request.ConversationId && m.ToProfileId == request.ProfileId && !m.Read).ToListAsync(cancellationToken);
        foreach (var m in messages) m.MarkAsRead();
        await _context.SaveChangesAsync(cancellationToken);
        return new MarkConversationReadResponse { Success = true };
    }
}
