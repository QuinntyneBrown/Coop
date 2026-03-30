using MediatR;

namespace Coop.Application.EventSourcing.Queries.GetStoredEventsPage;

public class GetStoredEventsPageRequest : IRequest<GetStoredEventsPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
