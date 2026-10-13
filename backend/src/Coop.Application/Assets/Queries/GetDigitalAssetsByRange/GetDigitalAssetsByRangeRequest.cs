using MediatR;

namespace Coop.Application.Assets.Queries.GetDigitalAssetsByRange;

public class GetDigitalAssetsByRangeRequest : IRequest<GetDigitalAssetsByRangeResponse>
{
    public List<Guid> DigitalAssetIds { get; set; } = new();
}
