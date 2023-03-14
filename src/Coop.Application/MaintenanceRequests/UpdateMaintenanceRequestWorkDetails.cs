using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class UpdateMaintenanceRequestWorkDetailsRequest : Coop.Domain.DomainEvents.UpdateMaintenanceRequestWorkDetails, IRequest<UpdateMaintenanceRequestWorkDetailsResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
public class UpdateMaintenanceRequestWorkDetailsResponse
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; }
}
public class UpdateMaintenanceRequestWorkDetailsHandler : IRequestHandler<UpdateMaintenanceRequestWorkDetailsRequest, UpdateMaintenanceRequestWorkDetailsResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateMaintenanceRequestWorkDetailsHandler(ICoopDbContext context)
    {
        _context = context;
    }
    public async Task<UpdateMaintenanceRequestWorkDetailsResponse> Handle(UpdateMaintenanceRequestWorkDetailsRequest request, CancellationToken cancellationToken)
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
