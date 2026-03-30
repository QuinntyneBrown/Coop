using Coop.Domain.Assets;

namespace Coop.Application.Assets.Dtos;

public class DigitalAssetDto
{
    public Guid DigitalAssetId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public int? Height { get; set; }
    public int? Width { get; set; }
    public DateTime CreatedOn { get; set; }

    public static DigitalAssetDto FromDigitalAsset(DigitalAsset da)
    {
        return new DigitalAssetDto
        {
            DigitalAssetId = da.DigitalAssetId,
            Name = da.Name,
            ContentType = da.ContentType,
            Height = da.Height,
            Width = da.Width,
            CreatedOn = da.CreatedOn
        };
    }
}
