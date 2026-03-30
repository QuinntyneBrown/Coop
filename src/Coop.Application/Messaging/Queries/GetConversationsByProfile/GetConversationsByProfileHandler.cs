using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Queries.GetConversationsByProfile;

public class GetConversationsByProfileHandler : IRequestHandler<GetConversationsByProfileRequest, GetConversationsByProfileResponse>
{
    private readonly ICoopDbContext _context;
    public GetConversationsByProfileHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetConversationsByProfileResponse> Handle(GetConversationsByProfileRequest request, CancellationToken cancellationToken)
    {
        var convos = await _context.Conversations.Include(c => c.Messages).Include(c => c.Profiles).Where(c => c.Profiles.Any(p => p.ProfileId == request.ProfileId) && !c.IsDeleted).ToListAsync(cancellationToken);
        return new GetConversationsByProfileResponse { Conversations = convos.Select(ConversationDto.FromConversation).ToList() };
    }
}
