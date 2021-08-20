using System;

namespace Coop.Api.Models
{
    public class ProfileCssCustomProperty
    {
        public Guid ProfileCssCustomPropertyId { get; private set; }
        public Guid ProfileId { get; private set; }
        public Guid CssCustomPropertyId { get; private set; }
        public CssCustomProperty CssCustomProperty { get; private set; }

        public ProfileCssCustomProperty(Guid cssCustomPropertyId)
        {
            CssCustomPropertyId = cssCustomPropertyId;
        }


        public ProfileCssCustomProperty(Guid profileId, CssCustomProperty cssCustomPropery)
        {
            ProfileId = profileId;
            CssCustomProperty = cssCustomPropery;
        }

        private ProfileCssCustomProperty()
        {

        }
    }
}
