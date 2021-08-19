using System;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class ProfileCssCustomPropertyExtensions
    {
        public static ProfileCssCustomPropertyDto ToDto(this ProfileCssCustomProperty profileCssCustomProperty)
        {
            return new()
            {
                ProfileCssCustomPropertyId = profileCssCustomProperty.ProfileCssCustomPropertyId
            };
        }

    }
}
