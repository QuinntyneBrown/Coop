using Coop.Core.DomainEvents;
using System;

namespace Coop.Core.Models
{
    public class Member : Profile
    {
        public Guid MemberId { get; private set; }
        public Member(Guid userId, string firstname, string lastname)
            : base(ProfileType.Member, userId, firstname, lastname)
        { }

        public Member(string firstname, string lastname)
            : base(ProfileType.Member, firstname, lastname)
        {

        }

        public Member(string firstname, string lastname, Address address)
            : base(ProfileType.Member, firstname, lastname)
        {
            Address = address;
        }

        public Member(CreateProfile createProfile)
            : base(createProfile)
        {
            Apply(createProfile);
        }

        private Member()
        {

        }

        protected override void When(dynamic @event)
        {
            this.When(@event);
        }

        public void When(CreateProfile createProfile)
        {
            ProfileId = createProfile.ProfileId;
            Firstname = createProfile.Firstname;
            Lastname = createProfile.Lastname;
            AvatarDigitalAssetId = createProfile.AvatarDigitalAssetId;
            Type = ProfileType.Member;
        }
    }
}
