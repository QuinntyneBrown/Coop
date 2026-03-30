using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.CompleteMaintenanceRequest;

public class CompleteMaintenanceRequestHandler : IRequestHandler<CompleteMaintenanceRequestRequest, CompleteMaintenanceRequestResponse>
{
    private readonly ICoopDbContext _context;

    public CompleteMaintenanceRequestHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<CompleteMaintenanceRequestResponse> Handle(CompleteMaintenanceRequestRequest request, CancellationToken cancellationToken)
    {
        var mr = await _context.MaintenanceRequests
            .Include(m => m.Comments).Include(m => m.DigitalAssets)
            .SingleAsync(m => m.MaintenanceRequestId == request.MaintenanceRequestId, cancellationToken);
        mr.Complete();
        await _context.SaveChangesAsync(cancellationToken);
        return new CompleteMaintenanceRequestResponse { MaintenanceRequest = MaintenanceRequestDto.FromMaintenanceRequest(mr) };
    }
}
