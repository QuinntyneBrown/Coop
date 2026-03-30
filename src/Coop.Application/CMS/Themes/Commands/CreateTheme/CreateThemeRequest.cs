using MediatR;

namespace Coop.Application.CMS.Themes.Commands.CreateTheme;

public class CreateThemeRequest : IRequest<CreateThemeResponse>
{
    public Guid? ProfileId { get; set; }
    public string CssCustomProperties { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
}
