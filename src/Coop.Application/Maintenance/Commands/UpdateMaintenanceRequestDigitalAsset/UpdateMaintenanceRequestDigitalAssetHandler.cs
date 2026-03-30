using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestDigitalAsset;

public class UpdateMaintenanceRequestDigitalAssetHandler : IRequestHandler<UpdateMaintenanceRequestDigitalAssetRequest, UpdateMaintenanceRequestDigitalAssetResponse>
{
    private readonly ICoopDbContext _context;

    public UpdateMaintenanceRequestDigitalAssetHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<UpdateMaintenanceRequestDigitalAssetResponse> Handle(UpdateMaintenanceRequestDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        var da = await _context.MaintenanceRequestDigitalAssets.SingleAsync(d => d.MaintenanceRequestDigitalAssetId == request.MaintenanceRequestDigitalAssetId, cancellationToken);
        da.DigitalAssetId = request.DigitalAssetId;
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateMaintenanceRequestDigitalAssetResponse { MaintenanceRequestDigitalAsset = MaintenanceRequestDigitalAssetDto.FromDigitalAsset(da) };
    }
}
