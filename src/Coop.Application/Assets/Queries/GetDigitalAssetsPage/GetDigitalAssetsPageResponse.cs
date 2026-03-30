using Coop.Application.Assets.Dtos;

namespace Coop.Application.Assets.Queries.GetDigitalAssetsPage;

public class GetDigitalAssetsPageResponse
{
    public List<DigitalAssetDto> DigitalAssets { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
