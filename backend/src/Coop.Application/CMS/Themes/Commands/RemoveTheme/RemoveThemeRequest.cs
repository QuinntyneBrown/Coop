using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.CMS.Themes.Commands.RemoveTheme;

[OfficeOnly]
public class RemoveThemeRequest : IRequest<RemoveThemeResponse>
{
    public Guid ThemeId { get; set; }
}
