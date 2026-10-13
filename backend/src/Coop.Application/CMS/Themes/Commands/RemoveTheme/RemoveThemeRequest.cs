using MediatR;

namespace Coop.Application.CMS.Themes.Commands.RemoveTheme;

public class RemoveThemeRequest : IRequest<RemoveThemeResponse>
{
    public Guid ThemeId { get; set; }
}
