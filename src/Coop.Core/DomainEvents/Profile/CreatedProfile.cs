using System;

namespace Coop.Core.DomainEvents
{
    public class CreatedProfile : BaseDomainEvent
    {
        public Guid UserId { get; set; }
        public Guid ProfileId { get; set; }
    }
}
