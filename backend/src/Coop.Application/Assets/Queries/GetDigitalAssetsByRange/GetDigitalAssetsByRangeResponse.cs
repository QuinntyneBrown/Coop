using Coop.Application.Assets.Dtos;

namespace Coop.Application.Assets.Queries.GetDigitalAssetsByRange;

public class GetDigitalAssetsByRangeResponse
{
    public List<DigitalAssetDto> DigitalAssets { get; set; } = new();
}
