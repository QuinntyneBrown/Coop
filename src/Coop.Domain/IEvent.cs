using MediatR;
using System;

namespace Coop.Domain;

public interface IEvent : INotification
{
    DateTime Created { get; }
    Guid CorrelationId { get; }
    void WithCorrelationIdFrom(IEvent @event);
}
