using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Messaging.Commands.DeleteConversation;

[OfficeOnly]
public class DeleteConversationRequest : IRequest<DeleteConversationResponse>
{
    public Guid ConversationId { get; set; }
}
