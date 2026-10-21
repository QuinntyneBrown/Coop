using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Messaging.Commands.DeleteMessage;

[OfficeOnly]
public class DeleteMessageRequest : IRequest<DeleteMessageResponse>
{
    public Guid MessageId { get; set; }
}
