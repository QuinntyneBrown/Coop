using MediatR;

namespace Coop.Application.CMS.Themes.Queries.GetThemesPage;

public class GetThemesPageRequest : IRequest<GetThemesPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
