using Newtonsoft.Json.Linq;
using System;

namespace Coop.Api.Models
{
    public class JsonContent
    {
        public Guid JsonContentId { get; private set; }
        public JObject Json { get; private set; }
        public JsonContent(string type, JObject json)
        {

            Json = json;
        }

        public JsonContent(JObject json)
        {
            Json = json;
        }

        protected JsonContent()
        {

        }
    }
}