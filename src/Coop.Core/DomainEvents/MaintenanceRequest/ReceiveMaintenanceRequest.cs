using System;

namespace Coop.Core.DomainEvents
{
    public class ReceiveMaintenanceRequest: BaseDomainEvent
    {
        public string ReceivedByName { get; set; }
        public Guid ReceivedByProfileId { get; set; }
    }
}
