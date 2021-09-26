﻿using Coop.Core.Dtos;
using Coop.Core.Models;
using System;

namespace Coop.Core.DomainEvents
{
    public class CreateMaintenanceRequest : EventBase
    {
        public Guid MaintenanceRequestId { get; set; } = Guid.NewGuid();
        public Guid RequestedByProfileId { get; set; }
        public string RequestedByName { get; set; }
        public AddressDto Address { get; set; }
        public string Phone { get; set; }
        public string Description { get; set; }
        public bool UnattendedUnitEntryAllowed { get; set; }

    }
}
