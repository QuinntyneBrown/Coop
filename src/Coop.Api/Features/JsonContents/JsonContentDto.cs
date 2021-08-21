using Coop.Api.Models;
using Newtonsoft.Json.Linq;
using System;

namespace Coop.Api.Features
{
    public class JsonContentDto
    {
        public Guid JsonContentId { get; set; }
        public JObject Json { get; set; }
    }
}
