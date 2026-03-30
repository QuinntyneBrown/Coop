namespace Coop.Domain.Maintenance;

public class MaintenanceRequestDigitalAsset
{
    public Guid MaintenanceRequestDigitalAssetId { get; set; } = Guid.NewGuid();
    public Guid MaintenanceRequestId { get; set; }
    public Guid DigitalAssetId { get; set; }
    public bool IsDeleted { get; set; }

    public void Delete()
    {
        IsDeleted = true;
    }
}
