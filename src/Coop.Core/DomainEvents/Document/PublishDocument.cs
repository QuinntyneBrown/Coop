using System;

namespace Coop.Core.DomainEvents.Document
{
    public class PublishDocument : BaseDomainEvent
    {
        public DateTime? Published { get; set; }
    }
}
