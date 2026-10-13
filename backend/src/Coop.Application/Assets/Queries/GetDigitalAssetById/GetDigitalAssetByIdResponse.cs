using Coop.Application.Assets.Dtos;

namespace Coop.Application.Assets.Queries.GetDigitalAssetById;

public class GetDigitalAssetByIdResponse
{
    public DigitalAssetDto DigitalAsset { get; set; } = default!;
}
