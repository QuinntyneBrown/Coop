using System;
using System.Collections.Generic;

namespace Coop.Api.Features
{
    public class JsonContentTypeDto
    {
        public Guid JsonContentTypeId { get; set; }
        public string Name { get; set; }
        public List<JsonContentDto> JsonContents { get; set; }
        public JsonContentDto JsonContent { get; set; }
    }
}
