using Coop.Application.CMS.Dtos;

namespace Coop.Application.CMS.Themes.Queries.GetThemeById;

public class GetThemeByIdResponse
{
    public ThemeDto Theme { get; set; } = default!;
}
