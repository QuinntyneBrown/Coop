using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.RemoveMaintenanceRequest;

public class RemoveMaintenanceRequestHandler : IRequestHandler<RemoveMaintenanceRequestRequest, RemoveMaintenanceRequestResponse>
{
    private readonly ICoopDbContext _context;

    public RemoveMaintenanceRequestHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<RemoveMaintenanceRequestResponse> Handle(RemoveMaintenanceRequestRequest request, CancellationToken cancellationToken)
    {
        var mr = await _context.MaintenanceRequests.Include(m => m.Comments).Include(m => m.DigitalAssets)
            .SingleAsync(m => m.MaintenanceRequestId == request.MaintenanceRequestId, cancellationToken);
        mr.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveMaintenanceRequestResponse { MaintenanceRequest = MaintenanceRequestDto.FromMaintenanceRequest(mr) };
    }
}
