// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;

namespace Coop.Domain.DomainEvents;

public class ReceiveMaintenanceRequest : BaseDomainEvent
{
    public string ReceivedByName { get; set; }
    public Guid ReceivedByProfileId { get; set; }
}

