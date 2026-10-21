using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Assets.Commands.RemoveDigitalAsset;

[OfficeOnly]
public class RemoveDigitalAssetRequest : IRequest<RemoveDigitalAssetResponse>
{
    public Guid DigitalAssetId { get; set; }
}
