using MediatR;

namespace Coop.Application.Messaging.Commands.MarkMessageAsRead;

public class MarkMessageAsReadRequest : IRequest<MarkMessageAsReadResponse>
{
    public Guid MessageId { get; set; }
}
