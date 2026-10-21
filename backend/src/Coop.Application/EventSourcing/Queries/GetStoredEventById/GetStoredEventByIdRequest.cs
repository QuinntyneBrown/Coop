using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.EventSourcing.Queries.GetStoredEventById;

[OfficeOnly]
public class GetStoredEventByIdRequest : IRequest<GetStoredEventByIdResponse>
{
    public Guid StoredEventId { get; set; }
}
