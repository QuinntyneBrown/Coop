using MediatR;

namespace Coop.Application.Messaging.Commands.DeleteConversation;

public class DeleteConversationRequest : IRequest<DeleteConversationResponse>
{
    public Guid ConversationId { get; set; }
}
