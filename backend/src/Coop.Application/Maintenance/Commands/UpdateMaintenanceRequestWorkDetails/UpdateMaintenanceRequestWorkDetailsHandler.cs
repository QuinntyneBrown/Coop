using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestWorkDetails;

public class UpdateMaintenanceRequestWorkDetailsHandler : IRequestHandler<UpdateMaintenanceRequestWorkDetailsRequest, UpdateMaintenanceRequestWorkDetailsResponse>
{
    private readonly ICoopDbContext _context;

    public UpdateMaintenanceRequestWorkDetailsHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<UpdateMaintenanceRequestWorkDetailsResponse> Handle(UpdateMaintenanceRequestWorkDetailsRequest request, CancellationToken cancellationToken)
    {
        var mr = await _context.MaintenanceRequests.Include(m => m.Comments).Include(m => m.DigitalAssets)
            .SingleAsync(m => m.MaintenanceRequestId == request.MaintenanceRequestId, cancellationToken);
        mr.WorkDetails = request.WorkDetails;
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateMaintenanceRequestWorkDetailsResponse { MaintenanceRequest = MaintenanceRequestDto.FromMaintenanceRequest(mr) };
    }
}
