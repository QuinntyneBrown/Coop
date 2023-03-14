using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class CompleteMaintenanceRequestRequest : Coop.Domain.DomainEvents.CompleteMaintenanceRequest, IRequest<CompleteMaintenanceRequestResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
public class CompleteMaintenanceRequestResponse
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; }
}
public class CompleteMaintenanceRequestHandler : IRequestHandler<CompleteMaintenanceRequestRequest, CompleteMaintenanceRequestResponse>
{
    private readonly ICoopDbContext _context;
    public CompleteMaintenanceRequestHandler(ICoopDbContext context)
    {
        _context = context;
    }
    public async Task<CompleteMaintenanceRequestResponse> Handle(CompleteMaintenanceRequestRequest request, CancellationToken cancellationToken)
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
