using MediatR;

namespace Coop.Application.EventSourcing.Queries.GetStoredEventById;

public class GetStoredEventByIdRequest : IRequest<GetStoredEventByIdResponse>
{
    public Guid StoredEventId { get; set; }
}
