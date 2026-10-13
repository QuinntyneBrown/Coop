using Coop.Application.Common.Interfaces;
using Coop.Application.Messaging.Dtos;
using Coop.Domain.Messaging;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Messaging.Commands.CreateConversation;

public class CreateConversationHandler : IRequestHandler<CreateConversationRequest, CreateConversationResponse>
{
    private readonly ICoopDbContext _context;
    public CreateConversationHandler(ICoopDbContext context) { _context = context; }

    public async Task<CreateConversationResponse> Handle(CreateConversationRequest request, CancellationToken cancellationToken)
    {
        var conversation = new Conversation();
        foreach (var pid in request.ProfileIds)
            conversation.Profiles.Add(new ConversationProfile { ConversationId = conversation.ConversationId, ProfileId = pid });
        _context.Conversations.Add(conversation);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateConversationResponse { Conversation = ConversationDto.FromConversation(conversation) };
    }
}
