using System;

namespace Coop.Core.DomainEvents
{
    public class CompleteMaintenanceRequest: EventBase
    {
        public string WorkCompletedByName { get; set; }
        public DateTime WorkCompleted { get; set; }
    }
}
