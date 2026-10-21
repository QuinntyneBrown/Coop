using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.EventSourcing.Queries.GetStoredEvents;

[OfficeOnly]
public class GetStoredEventsRequest : IRequest<GetStoredEventsResponse>
{

}
