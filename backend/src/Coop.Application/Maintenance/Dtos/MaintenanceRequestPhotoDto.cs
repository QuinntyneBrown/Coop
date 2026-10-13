using Coop.Domain.Assets;

namespace Coop.Application.Maintenance.Dtos;

public class MaintenanceRequestPhotoDto
{
    public Guid PhotoId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;

    public static string UrlFor(Guid maintenanceRequestId, Guid digitalAssetId)
        => $"/api/maintenance-requests/{maintenanceRequestId}/photos/{digitalAssetId}";

    public static MaintenanceRequestPhotoDto From(Guid maintenanceRequestId, DigitalAsset asset) => new()
    {
        PhotoId = asset.DigitalAssetId,
        Name = asset.Name,
        Url = UrlFor(maintenanceRequestId, asset.DigitalAssetId)
    };
}
