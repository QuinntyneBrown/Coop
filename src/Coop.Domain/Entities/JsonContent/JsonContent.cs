using Newtonsoft.Json.Linq;
using System;

namespace Coop.Domain.Entities
{
    public class JsonContent
    {
        public Guid JsonContentId { get; private set; }
        public JObject Json { get; private set; }
        public string Name { get; private set; }
        public JsonContent(JObject json)
        {
            Json = json;
        }

        public JsonContent(string name, JObject json)
        {
            Name = name;
            Json = json;
        }

        protected JsonContent()
        {

        }

        public void SetJson(JObject json)
        {
            Json = json;
        }
    }
}
