using System;

namespace Coop.Application.JsonContents.Exceptions
{
    public class DuplicateJsonContent: Exception
    {
        public DuplicateJsonContent()
            :base("Duplicate") { }
    }
}
