using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Queries.GetMessageById;

public class GetMessageByIdHandler : IRequestHandler<GetMessageByIdRequest, GetMessageByIdResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;
    public GetMessageByIdHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user) { _context = context; _authorization = authorization; _user = user; }

    public async Task<GetMessageByIdResponse> Handle(GetMessageByIdRequest request, CancellationToken cancellationToken)
    {
        var m = await _context.Messages.SingleAsync(m => m.MessageId == request.MessageId, cancellationToken);
        if (!await ConversationAccess.CanUseAsync(_context, _authorization, _user, m.ConversationId, cancellationToken))
            throw new UnauthorizedAccessException("Access denied.");
        return new GetMessageByIdResponse { Message = MessageDto.FromMessage(m) };
    }
}
