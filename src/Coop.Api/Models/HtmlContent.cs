using System;

namespace Coop.Api.Models
{
    public class HtmlContent
    {
        public Guid HtmlContentId { get; private set; }
        public string Name { get; private set; }
        public string Body { get; private set; }
        public HtmlContent(string name, string body)
        {
            Name = name;
            Body = body;
        }

        private HtmlContent()
        {

        }
    }
}
