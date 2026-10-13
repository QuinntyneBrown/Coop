using Coop.Application.CMS.Dtos;

namespace Coop.Application.CMS.Content.Queries.GetJsonContentsPage;

public class GetJsonContentsPageResponse
{
    public List<JsonContentDto> JsonContents { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
