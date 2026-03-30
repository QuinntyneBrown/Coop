using Coop.Application.Assets.Dtos;

namespace Coop.Application.Assets.Commands.RemoveDigitalAsset;

public class RemoveDigitalAssetResponse
{
    public DigitalAssetDto DigitalAsset { get; set; } = default!;
}
