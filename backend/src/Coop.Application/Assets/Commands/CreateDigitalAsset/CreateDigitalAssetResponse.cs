using Coop.Application.Assets.Dtos;

namespace Coop.Application.Assets.Commands.CreateDigitalAsset;

public class CreateDigitalAssetResponse
{
    public DigitalAssetDto DigitalAsset { get; set; } = default!;
}
