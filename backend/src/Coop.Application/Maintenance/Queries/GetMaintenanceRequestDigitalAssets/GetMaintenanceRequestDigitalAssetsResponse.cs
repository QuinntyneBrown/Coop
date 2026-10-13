using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestDigitalAssets;

public class GetMaintenanceRequestDigitalAssetsResponse
{
    public List<MaintenanceRequestDigitalAssetDto> MaintenanceRequestDigitalAssets { get; set; } = new();
}
