using System;

namespace Coop.Core.DomainEvents
{
    public class AddProfile : EventBase
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
