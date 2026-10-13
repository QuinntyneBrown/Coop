using MediatR;

namespace Coop.Application.Messaging.Commands.CreateConversation;

public class CreateConversationRequest : IRequest<CreateConversationResponse>
{
    public List<Guid> ProfileIds { get; set; } = new();
}
