using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using Coop.Domain.Maintenance;
using MediatR;

namespace Coop.Application.Maintenance.Commands.CreateMaintenanceRequestDigitalAsset;

public class CreateMaintenanceRequestDigitalAssetHandler : IRequestHandler<CreateMaintenanceRequestDigitalAssetRequest, CreateMaintenanceRequestDigitalAssetResponse>
{
    private readonly ICoopDbContext _context;

    public CreateMaintenanceRequestDigitalAssetHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<CreateMaintenanceRequestDigitalAssetResponse> Handle(CreateMaintenanceRequestDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        var da = new MaintenanceRequestDigitalAsset { MaintenanceRequestId = request.MaintenanceRequestId, DigitalAssetId = request.DigitalAssetId };
        _context.MaintenanceRequestDigitalAssets.Add(da);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateMaintenanceRequestDigitalAssetResponse { MaintenanceRequestDigitalAsset = MaintenanceRequestDigitalAssetDto.FromDigitalAsset(da) };
    }
}
