using MediatR;

namespace Coop.Application.Messaging.Queries.GetConversationBetween;

public class GetConversationBetweenRequest : IRequest<GetConversationBetweenResponse>
{
    public Guid ProfileIdA { get; set; }
    public Guid ProfileIdB { get; set; }
}
