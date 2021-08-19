using System;

namespace Coop.Api.Models
{
    public class ProfileCssCustomProperty
    {
        public Guid ProfileCssCustomPropertyId { get; private set; }
        public Guid ProfileId { get; private set; }
        public Guid CssCustomProperyId { get; private set; }

        public ProfileCssCustomProperty(Guid cssCustomProperyId)
        {
            CssCustomProperyId = cssCustomProperyId;
        }

        private ProfileCssCustomProperty()
        {

        }
    }
}
