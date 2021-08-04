using MediatR;
using System;

namespace Coop.Api.DomainEvents
{
    public class MaintenanceRequestDomainEvent : INotification
    {
        public Guid MaintenanceRequestDomainEventId { get; private set; }
        public Guid MaintenanceRequestId { get; private set; }
        public DateTime Created { get; private set; }
    }
}
