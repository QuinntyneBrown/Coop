using System;

namespace Coop.Core.DomainEvents
{
    public class CreatedJsonContent : BaseDomainEvent
    {
        public Guid JsonContentId { get; set; }
        public string Name { get; set; }
    }
}
