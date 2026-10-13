using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestDescription;

public class UpdateMaintenanceRequestDescriptionHandler : IRequestHandler<UpdateMaintenanceRequestDescriptionRequest, UpdateMaintenanceRequestDescriptionResponse>
{
    private readonly ICoopDbContext _context;

    public UpdateMaintenanceRequestDescriptionHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<UpdateMaintenanceRequestDescriptionResponse> Handle(UpdateMaintenanceRequestDescriptionRequest request, CancellationToken cancellationToken)
    {
        var mr = await _context.MaintenanceRequests.Include(m => m.Comments).Include(m => m.DigitalAssets)
            .SingleAsync(m => m.MaintenanceRequestId == request.MaintenanceRequestId, cancellationToken);
        mr.Description = request.Description;
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateMaintenanceRequestDescriptionResponse { MaintenanceRequest = MaintenanceRequestDto.FromMaintenanceRequest(mr) };
    }
}
