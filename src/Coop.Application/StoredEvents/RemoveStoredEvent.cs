using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class RemoveStoredEventRequest : IRequest<RemoveStoredEventResponse>
{
    public Guid StoredEventId { get; set; }
}
public class RemoveStoredEventResponse : ResponseBase
{
    public StoredEventDto StoredEvent { get; set; }
}
public class RemoveStoredEventHandler : IRequestHandler<RemoveStoredEventRequest, RemoveStoredEventResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveStoredEventHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveStoredEventResponse> Handle(RemoveStoredEventRequest request, CancellationToken cancellationToken)
    {
        var storedEvent = await _context.StoredEvents.SingleAsync(x => x.StoredEventId == request.StoredEventId);
        _context.StoredEvents.Remove(storedEvent);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveStoredEventResponse()
        {
            StoredEvent = storedEvent.ToDto()
        };
    }
}
