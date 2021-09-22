using Coop.Api.Models;

namespace Coop.Api.Features
{
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
}
