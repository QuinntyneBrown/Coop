using System;

namespace Coop.Domain.DomainEvents.Document;

public class PublishDocument : BaseDomainEvent
{
    public DateTime? Published { get; set; }
}
