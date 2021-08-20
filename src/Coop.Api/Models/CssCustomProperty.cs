using System;

namespace Coop.Api.Models
{
    public class CssCustomProperty
    {
        public Guid CssCustomPropertyId { get; private set; }
        public string Name { get; private set; }
        public string Value { get; private set; }
        public CssCustomPropertyType Type { get; private set; } = CssCustomPropertyType.System;
        public CssCustomProperty(string name, string value)
        {
            Name = name;
            Value = value;
        }

        public CssCustomProperty(CssCustomPropertyType type, string name, string value)
        {
            Type = type;
            Name = name;
            Value = value;
        }

        private CssCustomProperty()
        {

        }

        public void SetValue(string value)
        {
            Value = value;
        }
    }
}
