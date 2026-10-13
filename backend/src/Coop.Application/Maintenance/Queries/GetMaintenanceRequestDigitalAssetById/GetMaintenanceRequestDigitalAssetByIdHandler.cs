using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestDigitalAssetById;

public class GetMaintenanceRequestDigitalAssetByIdHandler : IRequestHandler<GetMaintenanceRequestDigitalAssetByIdRequest, GetMaintenanceRequestDigitalAssetByIdResponse>
{
    private readonly ICoopDbContext _context;

    public GetMaintenanceRequestDigitalAssetByIdHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetMaintenanceRequestDigitalAssetByIdResponse> Handle(GetMaintenanceRequestDigitalAssetByIdRequest request, CancellationToken cancellationToken)
    {
        var da = await _context.MaintenanceRequestDigitalAssets.SingleAsync(d => d.MaintenanceRequestDigitalAssetId == request.MaintenanceRequestDigitalAssetId, cancellationToken);
        return new GetMaintenanceRequestDigitalAssetByIdResponse { MaintenanceRequestDigitalAsset = MaintenanceRequestDigitalAssetDto.FromDigitalAsset(da) };
    }
}
