using Coop.Application.Common.Interfaces;
using Coop.Application.EventSourcing.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.EventSourcing.Queries.GetStoredEventById;

public class GetStoredEventByIdHandler : IRequestHandler<GetStoredEventByIdRequest, GetStoredEventByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetStoredEventByIdHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetStoredEventByIdResponse> Handle(GetStoredEventByIdRequest request, CancellationToken cancellationToken)
    {
        var se = await _context.StoredEvents.SingleAsync(x => x.StoredEventId == request.StoredEventId, cancellationToken);
        return new GetStoredEventByIdResponse { StoredEvent = StoredEventDto.FromStoredEvent(se) };
    }
}
