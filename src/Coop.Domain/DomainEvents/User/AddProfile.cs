using System;

namespace Coop.Domain.DomainEvents
{
    public class AddProfile : BaseDomainEvent
    {
        public Guid UserId { get; set; }
        public Guid ProfileId { get; set; }

        public AddProfile(Guid userId, Guid profileId)
        {
            UserId = userId;
            ProfileId = profileId;
        }

        public void Deconstruct(out Guid userId, out Guid profileId)
        {
            userId = UserId;
            profileId = ProfileId;
        }
    }
}
