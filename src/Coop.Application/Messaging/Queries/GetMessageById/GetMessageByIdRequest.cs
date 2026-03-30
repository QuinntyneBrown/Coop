using MediatR;

namespace Coop.Application.Messaging.Queries.GetMessageById;

public class GetMessageByIdRequest : IRequest<GetMessageByIdResponse>
{
    public Guid MessageId { get; set; }
}
