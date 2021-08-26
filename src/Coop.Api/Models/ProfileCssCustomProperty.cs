using System;

namespace Coop.Api.Models
{
    public class ProfileCssCustomProperty : CssCustomProperty
    {
        public Guid ProfileCssCustomPropertyId { get; private set; }
        public Guid ProfileId { get; private set; }

        public ProfileCssCustomProperty(Guid profileId, string name, string value)
            : base(CssCustomPropertyType.Profile, name, value)
        {
            ProfileId = profileId;
        }

        public ProfileCssCustomProperty(string name, string value)
            : base(CssCustomPropertyType.Profile, name, value)
        {

        }

        private ProfileCssCustomProperty()
        {

        }
    }
}
