using Coop.Application.EventSourcing.Dtos;

namespace Coop.Application.EventSourcing.Queries.GetStoredEventById;

public class GetStoredEventByIdResponse
{
    public StoredEventDto StoredEvent { get; set; } = default!;
}
