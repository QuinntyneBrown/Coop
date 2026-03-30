using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequest;

public class UpdateMaintenanceRequestHandler : IRequestHandler<UpdateMaintenanceRequestRequest, UpdateMaintenanceRequestResponse>
{
    private readonly ICoopDbContext _context;

    public UpdateMaintenanceRequestHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<UpdateMaintenanceRequestResponse> Handle(UpdateMaintenanceRequestRequest request, CancellationToken cancellationToken)
    {
        var mr = await _context.MaintenanceRequests.Include(m => m.Comments).Include(m => m.DigitalAssets)
            .SingleAsync(m => m.MaintenanceRequestId == request.MaintenanceRequestId, cancellationToken);
        mr.Title = request.Title;
        mr.Description = request.Description;
        mr.Phone = request.Phone;
        mr.UnitNumber = request.UnitNumber;
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateMaintenanceRequestResponse { MaintenanceRequest = MaintenanceRequestDto.FromMaintenanceRequest(mr) };
    }
}
