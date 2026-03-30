using Coop.Application.Common.Interfaces;
using Coop.Application.EventSourcing.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.EventSourcing.Queries.GetStoredEventsPage;

public class GetStoredEventsPageHandler : IRequestHandler<GetStoredEventsPageRequest, GetStoredEventsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetStoredEventsPageHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetStoredEventsPageResponse> Handle(GetStoredEventsPageRequest request, CancellationToken cancellationToken)
    {
        var q = _context.StoredEvents.AsQueryable();
        var tc = await q.CountAsync(cancellationToken);
        var ses = await q.Skip(request.Index * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);
        return new GetStoredEventsPageResponse { StoredEvents = ses.Select(StoredEventDto.FromStoredEvent).ToList(), TotalCount = tc, PageSize = request.PageSize, PageIndex = request.Index };
    }
}
