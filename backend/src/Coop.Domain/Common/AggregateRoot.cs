using Coop.Domain.EventSourcing;
using Newtonsoft.Json;

namespace Coop.Domain.Common;

public abstract class AggregateRoot : IAggregateRoot
{
    internal List<StoredEvent> _storedEvents = new();

    public IReadOnlyList<StoredEvent> StoredEvents => _storedEvents.AsReadOnly();

    protected void Apply(dynamic @event)
    {
        When(@event);
        StoreEvent(@event);
    }

    protected abstract void When(dynamic @event);

    protected void StoreEvent(IEvent @event)
    {
        _storedEvents.Add(new StoredEvent
        {
            Data = JsonConvert.SerializeObject(@event),
            CreatedOn = @event.Created,
            CorrelationId = @event.CorrelationId
        });
    }

    public abstract void EnsureValidState();

    public void ClearStoredEvents()
    {
        _storedEvents.Clear();
    }
}
