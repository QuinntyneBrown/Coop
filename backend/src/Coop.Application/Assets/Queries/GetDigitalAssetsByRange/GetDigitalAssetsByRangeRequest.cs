using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Assets.Queries.GetDigitalAssetsByRange;

[OfficeOnly]
public class GetDigitalAssetsByRangeRequest : IRequest<GetDigitalAssetsByRangeResponse>
{
    public List<Guid> DigitalAssetIds { get; set; } = new();
}
