using Coop.Core.Models;
using System;

namespace Coop.Core.DomainEvents
{
    public class UpdateMaintenanceRequest : EventBase
    {
        public Guid RequestedByProfileId { get; set; }
        public string RequestedByName { get; set; }
        public Address Address { get; set; }
        public string Phone { get; set; }
        public string Description { get; set; }
        public bool UnattendedUnitEntryAllowed { get; set; }

    }
}
