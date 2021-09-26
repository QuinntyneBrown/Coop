using System;

namespace Coop.Core.DomainEvents
{
    public class ReceiveMaintenanceRequest: IEvent
    {
        public string ReceivedByName { get; set; }
        public DateTime Created { get; set; }
    }
}
