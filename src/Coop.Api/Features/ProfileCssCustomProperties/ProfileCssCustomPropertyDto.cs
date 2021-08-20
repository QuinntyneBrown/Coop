using System;

namespace Coop.Api.Features
{
    public class ProfileCssCustomPropertyDto
    {
        public Guid ProfileCssCustomPropertyId { get; set; }
        public CssCustomPropertyDto CssCustomProperty { get; set; }
    }
}
