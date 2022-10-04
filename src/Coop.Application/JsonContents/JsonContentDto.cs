using Newtonsoft.Json.Linq;
using System;

namespace Coop.Application.JsonContents
{
    public class JsonContentDto
    {
        public Guid? JsonContentId { get; set; }
        public string Name { get; set; } = "";
        public JObject Json { get; set; } = JObject.FromObject(new { });
    }
}
