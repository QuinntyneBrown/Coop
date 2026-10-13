using MediatR;

namespace Coop.Domain.Common;

public interface IEvent : INotification
{
    DateTime Created { get; }
    Guid CorrelationId { get; }
}
