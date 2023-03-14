// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;

namespace Coop.Domain;

public abstract class BaseDomainEvent : INotification, IEvent
{
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public Guid CorrelationId { get; protected set; } = Guid.NewGuid();
    public BaseDomainEvent(BaseDomainEvent @event)
    {
        CorrelationId = @event.CorrelationId;
    }
    public BaseDomainEvent()
    {
    }
    public void WithCorrelationIdFrom(IEvent @event)
    {
        CorrelationId = @event.CorrelationId;
    }
}

