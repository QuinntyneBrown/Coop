using MediatR;

namespace Coop.Application.Assets.Queries.GetDigitalAssetById;

public class GetDigitalAssetByIdRequest : IRequest<GetDigitalAssetByIdResponse>
{
    public Guid DigitalAssetId { get; set; }
}
