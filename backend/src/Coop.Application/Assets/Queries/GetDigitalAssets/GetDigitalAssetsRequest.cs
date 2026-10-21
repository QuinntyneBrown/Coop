using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Assets.Queries.GetDigitalAssets;

[OfficeOnly]
public class GetDigitalAssetsRequest : IRequest<GetDigitalAssetsResponse>
{

}
