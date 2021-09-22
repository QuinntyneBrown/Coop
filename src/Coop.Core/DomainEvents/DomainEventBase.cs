using MediatR;
using System;

namespace Coop.Core.DomainEvents
{
    public abstract class DomainEventBase : INotification
    {
        public Guid CorrelationId { get; set; } = Guid.NewGuid();
        public DateTime Created { get; set; } = DateTime.UtcNow;
    }
}
