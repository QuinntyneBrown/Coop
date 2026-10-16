using Coop.Domain.Tenancy;

namespace Coop.Domain.Assets;

public class DigitalAsset : ITenantOwned
{
    public Guid DigitalAssetId { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public byte[] Bytes { get; set; } = Array.Empty<byte>();
    public int? Height { get; set; }
    public int? Width { get; set; }
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; }

    public void Delete()
    {
        IsDeleted = true;
    }
}
