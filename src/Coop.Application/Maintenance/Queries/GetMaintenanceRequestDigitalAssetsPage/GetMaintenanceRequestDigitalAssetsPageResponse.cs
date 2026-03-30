using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestDigitalAssetsPage;

public class GetMaintenanceRequestDigitalAssetsPageResponse
{
    public List<MaintenanceRequestDigitalAssetDto> MaintenanceRequestDigitalAssets { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
