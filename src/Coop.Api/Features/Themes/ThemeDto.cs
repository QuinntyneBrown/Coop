using Newtonsoft.Json.Linq;
using System;

namespace Coop.Api.Features
{
    public class ThemeDto
    {
        public Guid ThemeId { get; set; }
        public Guid? ProfileId { get; set; }
        public JObject CssCustomProperties { get; set; }
    }
}
