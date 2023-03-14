using Coop.Domain.Entities;

namespace Coop.Application.Features;

public static class ThemeExtensions
{
    public static ThemeDto ToDto(this Theme theme)
    {
        return new()
        {
            ThemeId = theme.ThemeId,
            ProfileId = theme.ProfileId,
            CssCustomProperties = theme.CssCustomProperties
        };
    }
}
