using Coop.Application.EventSourcing.Dtos;

namespace Coop.Application.EventSourcing.Queries.GetStoredEventsPage;

public class GetStoredEventsPageResponse
{
    public List<StoredEventDto> StoredEvents { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
