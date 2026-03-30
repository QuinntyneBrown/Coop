using MediatR;

namespace Coop.Application.Assets.Commands.RemoveDigitalAsset;

public class RemoveDigitalAssetRequest : IRequest<RemoveDigitalAssetResponse>
{
    public Guid DigitalAssetId { get; set; }
}
