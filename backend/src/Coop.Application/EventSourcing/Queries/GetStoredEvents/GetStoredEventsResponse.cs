using Coop.Application.EventSourcing.Dtos;

namespace Coop.Application.EventSourcing.Queries.GetStoredEvents;

public class GetStoredEventsResponse
{
    public List<StoredEventDto> StoredEvents { get; set; } = new();
}
