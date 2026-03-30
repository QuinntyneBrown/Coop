using MediatR;

namespace Coop.Application.Messaging.Queries.GetUnreadMessages;

public class GetUnreadMessagesRequest : IRequest<GetUnreadMessagesResponse>
{
    public Guid ProfileId { get; set; }
}
