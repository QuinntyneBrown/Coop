using Coop.Core.Models;
using System;
using System.Collections.Generic;
using static Newtonsoft.Json.JsonConvert;
using static System.Runtime.Serialization.FormatterServices;

namespace Coop.Core
{
    public abstract class AggregateRoot : IAggregateRoot
    {
        public List<StoredEvent> StoredEvents { get; private set; } = new List<StoredEvent>();

        public AggregateRoot(IEnumerable<IEvent> events)
        {
            foreach (var @event in events) { When(@event); }
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

            StoredEvents.Add(storedEvent);
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

        public static TAggregateRoot Create<TAggregateRoot>()
            => (TAggregateRoot)GetUninitializedObject(typeof(TAggregateRoot));

    }
}