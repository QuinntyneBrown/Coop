using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Commands.RemoveMaintenanceRequestDigitalAsset;

public class RemoveMaintenanceRequestDigitalAssetHandler : IRequestHandler<RemoveMaintenanceRequestDigitalAssetRequest, RemoveMaintenanceRequestDigitalAssetResponse>
{
    private readonly ICoopDbContext _context;

    public RemoveMaintenanceRequestDigitalAssetHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<RemoveMaintenanceRequestDigitalAssetResponse> Handle(RemoveMaintenanceRequestDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        var da = await _context.MaintenanceRequestDigitalAssets.SingleAsync(d => d.MaintenanceRequestDigitalAssetId == request.MaintenanceRequestDigitalAssetId, cancellationToken);
        da.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveMaintenanceRequestDigitalAssetResponse { MaintenanceRequestDigitalAsset = MaintenanceRequestDigitalAssetDto.FromDigitalAsset(da) };
    }
}
