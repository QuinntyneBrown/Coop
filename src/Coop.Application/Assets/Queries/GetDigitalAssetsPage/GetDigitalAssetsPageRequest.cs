using MediatR;

namespace Coop.Application.Assets.Queries.GetDigitalAssetsPage;

public class GetDigitalAssetsPageRequest : IRequest<GetDigitalAssetsPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
