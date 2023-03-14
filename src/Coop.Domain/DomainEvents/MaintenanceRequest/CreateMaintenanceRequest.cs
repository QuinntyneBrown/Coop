// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Dtos;
using Coop.Domain.Entities;
using System;

namespace Coop.Domain.DomainEvents;

public class CreateMaintenanceRequest : BaseDomainEvent
{
    public Guid MaintenanceRequestId { get; set; } = Guid.NewGuid();
    public Guid RequestedByProfileId { get; set; }
    public string RequestedByName { get; set; }
    public Address Address { get; set; }
    public string Phone { get; set; }
    public string Description { get; set; }
    public bool UnattendedUnitEntryAllowed { get; set; }
}

