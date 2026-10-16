using Coop.Domain.Tenancy;

namespace Coop.Domain.Maintenance;

public class MaintenanceRequestDigitalAsset : ITenantOwned
{
    public Guid MaintenanceRequestDigitalAssetId { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public Guid MaintenanceRequestId { get; set; }
    public Guid DigitalAssetId { get; set; }
    public bool IsDeleted { get; set; }

    public void Delete()
    {
        IsDeleted = true;
    }
}
