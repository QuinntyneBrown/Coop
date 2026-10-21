using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Assets.Queries.GetDigitalAssetById;

[OfficeOnly]
public class GetDigitalAssetByIdRequest : IRequest<GetDigitalAssetByIdResponse>
{
    public Guid DigitalAssetId { get; set; }
}
