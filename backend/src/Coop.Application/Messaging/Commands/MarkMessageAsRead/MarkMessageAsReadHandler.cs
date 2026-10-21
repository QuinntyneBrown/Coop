using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using Coop.Domain.Messaging;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Commands.MarkMessageAsRead;

public class MarkMessageAsReadHandler : IRequestHandler<MarkMessageAsReadRequest, MarkMessageAsReadResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;
    public MarkMessageAsReadHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user) { _context = context; _authorization = authorization; _user = user; }

    public async Task<MarkMessageAsReadResponse> Handle(MarkMessageAsReadRequest request, CancellationToken cancellationToken)
    {
        var message = await _context.Messages.SingleAsync(m => m.MessageId == request.MessageId, cancellationToken);
        if (!await ConversationAccess.CanUseAsync(_context, _authorization, _user, message.ConversationId, cancellationToken))
            throw new UnauthorizedAccessException("Access denied.");
        message.MarkAsRead();
        await _context.SaveChangesAsync(cancellationToken);
        return new MarkMessageAsReadResponse { Success = true };
    }
}
