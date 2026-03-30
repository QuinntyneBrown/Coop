using MediatR;

namespace Coop.Application.Messaging.Queries.GetUnreadMessageCount;

public class GetUnreadMessageCountRequest : IRequest<GetUnreadMessageCountResponse>
{
    public Guid ProfileId { get; set; }
}
