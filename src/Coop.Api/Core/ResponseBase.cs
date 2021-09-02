using System.Collections.Generic;

namespace Coop.Api.Core
{
    public class ResponseBase
    {
        public List<string> Errors { get; set; } = new();
    }
}
