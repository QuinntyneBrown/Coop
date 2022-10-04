using System;

namespace Coop.Domain.DomainEvents
{
    public class CreatedUser : BaseDomainEvent
    {
        public Guid UserId { get; private set; }

        public CreatedUser(Guid userId)
        {
            UserId = userId;
        }
    }
}
