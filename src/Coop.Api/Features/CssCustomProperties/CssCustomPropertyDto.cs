using Coop.Api.Models;
using System;

namespace Coop.Api.Features
{
    public class CssCustomPropertyDto
    {
        public Guid? CssCustomPropertyId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public CssCustomPropertyType Type { get; set; }
    }
}
