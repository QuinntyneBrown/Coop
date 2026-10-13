using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestDigitalAssets;

public class GetMaintenanceRequestDigitalAssetsHandler : IRequestHandler<GetMaintenanceRequestDigitalAssetsRequest, GetMaintenanceRequestDigitalAssetsResponse>
{
    private readonly ICoopDbContext _context;

    public GetMaintenanceRequestDigitalAssetsHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetMaintenanceRequestDigitalAssetsResponse> Handle(GetMaintenanceRequestDigitalAssetsRequest request, CancellationToken cancellationToken)
    {
        var das = await _context.MaintenanceRequestDigitalAssets.Where(d => !d.IsDeleted).ToListAsync(cancellationToken);
        return new GetMaintenanceRequestDigitalAssetsResponse { MaintenanceRequestDigitalAssets = das.Select(MaintenanceRequestDigitalAssetDto.FromDigitalAsset).ToList() };
    }
}
