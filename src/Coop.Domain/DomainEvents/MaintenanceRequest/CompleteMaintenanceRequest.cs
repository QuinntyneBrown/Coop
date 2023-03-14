// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;

namespace Coop.Domain.DomainEvents;

public class CompleteMaintenanceRequest : BaseDomainEvent
{
    public string WorkCompletedByName { get; set; }
    public DateTime WorkCompleted { get; set; }
}

