using Coop.Application.Assets.Dtos;

namespace Coop.Application.Assets.Queries.GetDigitalAssets;

public class GetDigitalAssetsResponse
{
    public List<DigitalAssetDto> DigitalAssets { get; set; } = new();
}
