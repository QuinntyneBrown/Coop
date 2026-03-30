using Coop.Domain.Maintenance;

namespace Coop.Application.Maintenance.Dtos;

public class MaintenanceRequestDigitalAssetDto
{
    public Guid MaintenanceRequestDigitalAssetId { get; set; }
    public Guid MaintenanceRequestId { get; set; }
    public Guid DigitalAssetId { get; set; }

    public static MaintenanceRequestDigitalAssetDto FromDigitalAsset(MaintenanceRequestDigitalAsset da)
    {
        return new MaintenanceRequestDigitalAssetDto
        {
            MaintenanceRequestDigitalAssetId = da.MaintenanceRequestDigitalAssetId,
            MaintenanceRequestId = da.MaintenanceRequestId,
            DigitalAssetId = da.DigitalAssetId
        };
    }
}
