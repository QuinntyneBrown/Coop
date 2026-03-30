using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.StartMaintenanceRequest;

public class StartMaintenanceRequestHandler : IRequestHandler<StartMaintenanceRequestRequest, StartMaintenanceRequestResponse>
{
    private readonly ICoopDbContext _context;

    public StartMaintenanceRequestHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<StartMaintenanceRequestResponse> Handle(StartMaintenanceRequestRequest request, CancellationToken cancellationToken)
    {
        var mr = await _context.MaintenanceRequests
            .Include(m => m.Comments).Include(m => m.DigitalAssets)
            .SingleAsync(m => m.MaintenanceRequestId == request.MaintenanceRequestId, cancellationToken);
        mr.Start();
        await _context.SaveChangesAsync(cancellationToken);
        return new StartMaintenanceRequestResponse { MaintenanceRequest = MaintenanceRequestDto.FromMaintenanceRequest(mr) };
    }
}
