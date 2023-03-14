using System;

namespace Coop.Domain.DomainEvents;

public class AddedProfile : BaseDomainEvent
{
    public Guid UserId { get; set; }
    public Guid ProfileId { get; set; }
}
