using MediatR;

namespace Coop.Application.Messaging.Queries.GetMessagesByConversation;

public class GetMessagesByConversationRequest : IRequest<GetMessagesByConversationResponse>
{
    public Guid ConversationId { get; set; }
}
