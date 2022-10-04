using System.Collections.Generic;

namespace Coop.Domain
{
    public class BaseEntity
    {
        public List<BaseDomainEvent> Events = new List<BaseDomainEvent>();
    }
}
