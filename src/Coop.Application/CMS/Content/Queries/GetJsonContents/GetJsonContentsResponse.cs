using Coop.Application.CMS.Dtos;

namespace Coop.Application.CMS.Content.Queries.GetJsonContents;

public class GetJsonContentsResponse
{
    public List<JsonContentDto> JsonContents { get; set; } = new();
}
