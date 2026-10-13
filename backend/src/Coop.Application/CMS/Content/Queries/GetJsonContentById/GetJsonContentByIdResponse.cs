using Coop.Application.CMS.Dtos;

namespace Coop.Application.CMS.Content.Queries.GetJsonContentById;

public class GetJsonContentByIdResponse
{
    public JsonContentDto JsonContent { get; set; } = default!;
}
