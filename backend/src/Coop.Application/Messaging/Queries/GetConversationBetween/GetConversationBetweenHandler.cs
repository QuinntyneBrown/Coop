using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Queries.GetConversationBetween;

public class GetConversationBetweenHandler : IRequestHandler<GetConversationBetweenRequest, GetConversationBetweenResponse>
{
    private readonly ICoopDbContext _context;
    public GetConversationBetweenHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetConversationBetweenResponse> Handle(GetConversationBetweenRequest request, CancellationToken cancellationToken)
    {
        var c = await _context.Conversations.Include(c => c.Messages).Include(c => c.Profiles).FirstOrDefaultAsync(c => c.Profiles.Any(p => p.ProfileId == request.ProfileIdA) && c.Profiles.Any(p => p.ProfileId == request.ProfileIdB) && !c.IsDeleted, cancellationToken);
        return new GetConversationBetweenResponse { Conversation = c != null ? ConversationDto.FromConversation(c) : null };
    }
}
