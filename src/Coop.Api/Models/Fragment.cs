using System;
using System.Collections.Generic;

namespace Coop.Api.Models
{
    public class Fragment
    {
        public Guid FragmentId { get; private set; }
        public string Name { get; private set; }
        public List<JsonContent> JsonContents { get; private set; } = new List<JsonContent>();
        public HtmlContent HtmlContent { get; private set; }

        public Fragment(string name, HtmlContent htmlContent)
        {
            Name = name;
            HtmlContent = htmlContent;
        }

        private Fragment()
        {

        }

    }
}
