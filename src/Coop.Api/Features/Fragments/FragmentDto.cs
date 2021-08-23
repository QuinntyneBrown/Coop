using System;

namespace Coop.Api.Features
{
    public class FragmentDto
    {
        public Guid FragmentId { get; set; }
        public string Name { get; set; }
        public HtmlContentDto HtmlContent { get; set; }
    }
}
