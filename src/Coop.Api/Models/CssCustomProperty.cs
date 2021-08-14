using System;

namespace Coop.Api.Models
{
    public class CssCustomProperty
    {
        public Guid CssCustomPropertyId { get; private set; }
        public string Name { get; private set; }
        public string Value { get; private set; }

        public CssCustomProperty(string name, string value)
        {
            Name = name;
            Value = value;
        }

        private CssCustomProperty()
        {

        }
    }
}
