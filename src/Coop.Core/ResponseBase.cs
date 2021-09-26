using System.Collections.Generic;

namespace Coop.Core
{
    public class ResponseBase
    {
        public List<string> Errors { get; set; } = new();
    }
}
