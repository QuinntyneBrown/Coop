using Coop.Domain.CMS;

namespace Coop.Application.CMS.Dtos;

public class ThemeDto
{
    public Guid ThemeId { get; set; }
    public Guid? ProfileId { get; set; }
    public string CssCustomProperties { get; set; } = string.Empty;
    public bool IsDefault { get; set; }

    public static ThemeDto FromTheme(Theme theme)
    {
        return new ThemeDto
        {
            ThemeId = theme.ThemeId,
            ProfileId = theme.ProfileId,
            CssCustomProperties = theme.CssCustomProperties,
            IsDefault = theme.IsDefault
        };
    }
}
