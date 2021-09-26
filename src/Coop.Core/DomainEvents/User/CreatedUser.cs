using System;

namespace Coop.Core.DomainEvents
{
    public class CreatedUser : EventBase
    {
        public Guid UserId { get; private set; }

        public CreatedUser(Guid userId)
        {
            UserId = userId;
        }
    }
}
