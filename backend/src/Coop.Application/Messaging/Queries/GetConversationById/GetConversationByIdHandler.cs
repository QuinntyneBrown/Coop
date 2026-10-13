using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Queries.GetConversationById;

public class GetConversationByIdHandler : IRequestHandler<GetConversationByIdRequest, GetConversationByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetConversationByIdHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetConversationByIdResponse> Handle(GetConversationByIdRequest request, CancellationToken cancellationToken)
    {
        var c = await _context.Conversations.Include(c => c.Messages).Include(c => c.Profiles).SingleAsync(c => c.ConversationId == request.ConversationId, cancellationToken);
        return new GetConversationByIdResponse { Conversation = ConversationDto.FromConversation(c) };
    }
}
