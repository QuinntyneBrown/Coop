using Coop.Application.CMS.Dtos;

namespace Coop.Application.CMS.Themes.Queries.GetThemesPage;

public class GetThemesPageResponse
{
    public List<ThemeDto> Themes { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
