using System;

namespace Coop.Core.DomainEvents
{
    public class AddedProfile : BaseDomainEvent
    {
        public Guid UserId { get; set; }
        public Guid ProfileId { get; set; }
    }
}
