using Coop.Application.Common.Interfaces;
using Coop.Application.EventSourcing.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.EventSourcing.Queries.GetStoredEvents;

public class GetStoredEventsHandler : IRequestHandler<GetStoredEventsRequest, GetStoredEventsResponse>
{
    private readonly ICoopDbContext _context;
    public GetStoredEventsHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetStoredEventsResponse> Handle(GetStoredEventsRequest request, CancellationToken cancellationToken)
    {
        var ses = await _context.StoredEvents.ToListAsync(cancellationToken);
        return new GetStoredEventsResponse { StoredEvents = ses.Select(StoredEventDto.FromStoredEvent).ToList() };
    }
}
