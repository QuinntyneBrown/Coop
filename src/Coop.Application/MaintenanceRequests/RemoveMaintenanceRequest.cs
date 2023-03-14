using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class RemoveMaintenanceRequestRequest : Coop.Domain.DomainEvents.RemoveMaintenanceRequest, IRequest<RemoveMaintenanceRequestResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
public class RemoveMaintenanceRequestResponse : ResponseBase
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; }
}
public class RemoveMaintenanceRequestHandler : IRequestHandler<RemoveMaintenanceRequestRequest, RemoveMaintenanceRequestResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveMaintenanceRequestHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveMaintenanceRequestResponse> Handle(RemoveMaintenanceRequestRequest request, CancellationToken cancellationToken)
    {
        var maintenanceRequest = await _context.MaintenanceRequests.SingleAsync(x => x.MaintenanceRequestId == request.MaintenanceRequestId);
        maintenanceRequest.Apply(request);
        _context.MaintenanceRequests.Remove(maintenanceRequest);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            MaintenanceRequest = maintenanceRequest.ToDto()
        };
    }
}
