using MediatR;
using System;

namespace Coop.Core
{
    public abstract class BaseDomainEvent : INotification, IEvent
    {
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public Guid CorrelationId { get; protected set; } = Guid.NewGuid();

        public BaseDomainEvent(BaseDomainEvent @event)
        {
            CorrelationId = @event.CorrelationId;
        }

        public BaseDomainEvent()
        {

        }

        public void WithCorrelationIdFrom(IEvent @event)
        {
            CorrelationId = @event.CorrelationId;
        }
    }
}
