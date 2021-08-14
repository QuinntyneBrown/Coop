using System;
using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class CssCustomPropertyExtensions
    {
        public static CssCustomPropertyDto ToDto(this CssCustomProperty cssCustomProperty)
        {
            return new ()
            {
                CssCustomPropertyId = cssCustomProperty.CssCustomPropertyId
            };
        }
        
    }
}
