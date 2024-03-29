// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using static Newtonsoft.Json.JsonConvert;

namespace Coop.Domain;

public abstract class AggregateRoot : IAggregateRoot
{
    internal List<StoredEvent> _storedEvents = new List<StoredEvent>();
    [NotMapped]
    public IReadOnlyList<StoredEvent> StoredEvents => _storedEvents.AsReadOnly();
    public AggregateRoot(IEnumerable<IEvent> events)
    {
        foreach (var @event in events) { When(@event); }
    }
    public void Clear()
    {
        _storedEvents.Clear();
    }
    protected AggregateRoot()
    {
    }
    public void StoreEvent(IEvent @event)
    {
        var type = GetType();
        var eventType = @event.GetType();
        var resolvedEventType = eventType.Name == "Request" ? eventType.BaseType : eventType;
        var storedEvent = new StoredEvent
        {
            StoredEventId = Guid.NewGuid(),
            Aggregate = GetType().Name,
            AggregateDotNetType = GetType().AssemblyQualifiedName,
            Data = SerializeObject(@event),
            StreamId = (Guid)type.GetProperty($"{type.Name}Id").GetValue(this, null),
            DotNetType = resolvedEventType.AssemblyQualifiedName,
            Type = resolvedEventType.Name,
            CreatedOn = @event.Created,
            CorrelationId = new Guid()
        };
        _storedEvents.Add(storedEvent);
    }
    public AggregateRoot Apply(IEvent @event)
    {
        When(@event);
        EnsureValidState();
        StoreEvent(@event);
        return this;
    }
    protected abstract void When(dynamic @event);
    protected abstract void EnsureValidState();
}

