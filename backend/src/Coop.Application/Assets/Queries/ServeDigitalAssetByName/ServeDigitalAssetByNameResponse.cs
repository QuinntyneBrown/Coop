namespace Coop.Application.Assets.Queries.ServeDigitalAssetByName;

public class ServeDigitalAssetByNameResponse
{
    public byte[] Bytes { get; set; } = Array.Empty<byte>();
    public string ContentType { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}
