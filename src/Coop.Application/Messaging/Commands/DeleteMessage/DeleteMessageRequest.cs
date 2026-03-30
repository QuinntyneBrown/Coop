using MediatR;

namespace Coop.Application.Messaging.Commands.DeleteMessage;

public class DeleteMessageRequest : IRequest<DeleteMessageResponse>
{
    public Guid MessageId { get; set; }
}
