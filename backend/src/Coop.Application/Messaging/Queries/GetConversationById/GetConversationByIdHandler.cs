using System.Security.Claims;
using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Queries.GetConversationById;

public class GetConversationByIdHandler : IRequestHandler<GetConversationByIdRequest, GetConversationByIdResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;
    public GetConversationByIdHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user) { _context = context; _authorization = authorization; _user = user; }

    public async Task<GetConversationByIdResponse> Handle(GetConversationByIdRequest request, CancellationToken cancellationToken)
    {
        if (!await ConversationAccess.CanUseAsync(_context, _authorization, _user, request.ConversationId, cancellationToken))
            throw new UnauthorizedAccessException("Access denied.");
        var c = await _context.Conversations.Include(c => c.Messages).Include(c => c.Profiles).SingleAsync(c => c.ConversationId == request.ConversationId, cancellationToken);
        return new GetConversationByIdResponse { Conversation = ConversationDto.FromConversation(c) };
    }
}
