using System.Collections.Generic;

namespace Coop.Core
{
    public class BaseEntity
    {
        public List<BaseDomainEvent> Events = new List<BaseDomainEvent>();
    }
}
