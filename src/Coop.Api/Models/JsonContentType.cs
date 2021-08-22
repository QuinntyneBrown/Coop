using System;
using System.Collections.Generic;
using System.Linq;

namespace Coop.Api.Models
{
    public class JsonContentType
    {
        public Guid JsonContentTypeId { get; private set; }
        public string Name { get; private set; }
        public bool Multi { get; private set; } = false;
        public List<JsonContent> JsonContents { get; set; }
        public JsonContent JsonContent => Multi ? null : JsonContents.First();
        public JsonContentType(string name)
        {
            Name = name;
        }

        private JsonContentType()
        {

        }
    }
}
