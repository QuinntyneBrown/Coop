using System;

namespace Coop.Core.DomainEvents
{
    public class CreateMaintenanceRequest: DomainEventBase
    {
        public CreateMaintenanceRequest()
        {

        }

        public Guid MaintenanceRequestId { get; private set; } = Guid.NewGuid();
    }
}
