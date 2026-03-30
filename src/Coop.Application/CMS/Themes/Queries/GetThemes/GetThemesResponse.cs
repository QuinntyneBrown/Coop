using Coop.Application.CMS.Dtos;

namespace Coop.Application.CMS.Themes.Queries.GetThemes;

public class GetThemesResponse
{
    public List<ThemeDto> Themes { get; set; } = new();
}
