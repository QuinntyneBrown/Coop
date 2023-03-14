// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Entities;
using System;

namespace Coop.Domain.DomainEvents;

public class StartMaintenanceRequest : BaseDomainEvent
{
    public UnitEntered UnitEntered { get; set; }
    public DateTime WorkStarted { get; set; }
}

