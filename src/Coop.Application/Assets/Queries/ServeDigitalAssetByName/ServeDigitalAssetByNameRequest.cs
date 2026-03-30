using MediatR;

namespace Coop.Application.Assets.Queries.ServeDigitalAssetByName;

public class ServeDigitalAssetByNameRequest : IRequest<ServeDigitalAssetByNameResponse>
{
    public string Name { get; set; } = string.Empty;
}
