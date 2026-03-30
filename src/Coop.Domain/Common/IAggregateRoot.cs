using Coop.Domain.EventSourcing;

namespace Coop.Domain.Common;

public interface IAggregateRoot
{
    IReadOnlyList<StoredEvent> StoredEvents { get; }
    void ClearStoredEvents();
}
