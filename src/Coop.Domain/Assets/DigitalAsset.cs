namespace Coop.Domain.Assets;

public class DigitalAsset
{
    public Guid DigitalAssetId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public byte[] Bytes { get; set; } = Array.Empty<byte>();
    public string ContentType { get; set; } = string.Empty;
    public int? Height { get; set; }
    public int? Width { get; set; }
    public long Size { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
