using MediatR;

namespace Coop.Application.Assets.Queries.ServeDigitalAsset;

public class ServeDigitalAssetRequest : IRequest<ServeDigitalAssetResponse>
{
    public Guid DigitalAssetId { get; set; }
}
