using MediatR;

namespace Coop.Application.CMS.Content.Queries.GetJsonContentsPage;

public class GetJsonContentsPageRequest : IRequest<GetJsonContentsPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
