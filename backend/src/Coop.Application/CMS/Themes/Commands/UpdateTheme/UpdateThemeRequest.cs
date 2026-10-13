using MediatR;

namespace Coop.Application.CMS.Themes.Commands.UpdateTheme;

public class UpdateThemeRequest : IRequest<UpdateThemeResponse>
{
    public Guid ThemeId { get; set; }
    public string CssCustomProperties { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
}
