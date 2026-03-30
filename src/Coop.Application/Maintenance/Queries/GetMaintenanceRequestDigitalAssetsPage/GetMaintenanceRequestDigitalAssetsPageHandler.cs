using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestDigitalAssetsPage;

public class GetMaintenanceRequestDigitalAssetsPageHandler : IRequestHandler<GetMaintenanceRequestDigitalAssetsPageRequest, GetMaintenanceRequestDigitalAssetsPageResponse>
{
    private readonly ICoopDbContext _context;

    public GetMaintenanceRequestDigitalAssetsPageHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetMaintenanceRequestDigitalAssetsPageResponse> Handle(GetMaintenanceRequestDigitalAssetsPageRequest request, CancellationToken cancellationToken)
    {
        var query = _context.MaintenanceRequestDigitalAssets.Where(d => !d.IsDeleted);
        var totalCount = await query.CountAsync(cancellationToken);
        var das = await query.Skip(request.Index * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);
        return new GetMaintenanceRequestDigitalAssetsPageResponse
        {
            MaintenanceRequestDigitalAssets = das.Select(MaintenanceRequestDigitalAssetDto.FromDigitalAsset).ToList(),
            TotalCount = totalCount, PageSize = request.PageSize, PageIndex = request.Index
        };
    }
}
