using MediatR;

namespace Coop.Application.Messaging.Queries.GetConversationById;

public class GetConversationByIdRequest : IRequest<GetConversationByIdResponse>
{
    public Guid ConversationId { get; set; }
}
