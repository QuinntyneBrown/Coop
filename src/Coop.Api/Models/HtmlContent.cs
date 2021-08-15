using System;

namespace Coop.Api.Models
{
    public class HtmlContent
    {
        public Guid HtmlContentId { get; private set; }
        public string PageName { get; private set; }
        public string Component { get; private set; }
        public string Name { get; private set; }
        public string Body { get; private set; }
        public HtmlContent(string component, string name, string body)
        {
            Component = component;
            Name = name;
            Body = body;
        }
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
