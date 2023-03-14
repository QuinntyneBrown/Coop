using Coop.Domain.Interfaces;
using Coop.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class StartMaintenanceRequestRequest : Coop.Domain.DomainEvents.StartMaintenanceRequest, IRequest<StartMaintenanceRequestResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
public class StartMaintenanceRequestResponse
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; }
}
public class StartMaintenanceRequestHandler : IRequestHandler<StartMaintenanceRequestRequest, StartMaintenanceRequestResponse>
{
    private readonly ICoopDbContext _context;
    public StartMaintenanceRequestHandler(ICoopDbContext context)
    {
        _context = context;
    }
    public async Task<StartMaintenanceRequestResponse> Handle(StartMaintenanceRequestRequest request, CancellationToken cancellationToken)
    {
        var maintenanceRequest = await _context.MaintenanceRequests.SingleAsync(x => x.MaintenanceRequestId == request.MaintenanceRequestId);
        maintenanceRequest.Apply(request);
        await _context.SaveChangesAsync(default);
        return new()
        {
            MaintenanceRequest = maintenanceRequest.ToDto()
        };
    }
}
