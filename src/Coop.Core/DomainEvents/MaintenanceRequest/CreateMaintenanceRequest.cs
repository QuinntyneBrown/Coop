using Coop.Core.Models;
using System;

namespace Coop.Core.DomainEvents
{
    public class CreateMaintenanceRequest : EventBase
    {
        public Guid MaintenanceRequestId { get; set; } = Guid.NewGuid();
        public string RequestByName { get; set; }
        public Address Address { get; set; }
        public string Phone { get; set; }
        public string Description { get; set; }
        public bool UnattendedUnitEntryAllowed { get; set; }

    }
}
