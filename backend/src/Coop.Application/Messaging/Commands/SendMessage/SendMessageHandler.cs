using System.Security.Claims;
using Coop.Application.Common;
using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using Coop.Domain.Messaging;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Commands.SendMessage;

public class SendMessageHandler : IRequestHandler<SendMessageRequest, SendMessageResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;
    public SendMessageHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user) { _context = context; _authorization = authorization; _user = user; }

    public async Task<SendMessageResponse> Handle(SendMessageRequest request, CancellationToken cancellationToken)
    {
        // A member always sends from one of their own profiles, into a conversation they take part in.
        var fromProfileId = request.FromProfileId;
        if (!await ConversationAccess.IsOfficeAsync(_authorization, _user)
            && !(await CallerAccess.OwnProfileIdsAsync(_context, _user, cancellationToken)).Contains(fromProfileId))
        {
            fromProfileId = await CallerAccess.CurrentProfileIdAsync(_context, _user, cancellationToken) ?? Guid.Empty;
        }
        if (!await ConversationAccess.CanUseAsync(_context, _authorization, _user, request.ConversationId, cancellationToken))
            throw new UnauthorizedAccessException("Access denied.");
        var message = new Message
        {
            ConversationId = request.ConversationId,
            FromProfileId = fromProfileId,
            ToProfileId = request.ToProfileId,
            Body = request.Body
        };
        _context.Messages.Add(message);
        await _context.SaveChangesAsync(cancellationToken);
        return new SendMessageResponse { Message = MessageDto.FromMessage(message) };
    }
}
