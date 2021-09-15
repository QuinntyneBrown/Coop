using System.Collections.Generic;

namespace Coop.Api.Core
{
    public class BaseEntity
    {
        public List<BaseDomainEvent> Events = new List<BaseDomainEvent>();
    }
}
