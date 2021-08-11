using System;

namespace Coop.Api.Models
{
    public class Member: Profile
    {
        public Guid MemberId { get; private set; }        
        public Member(Guid userId, string firstname, string lastname)
            :base(ProfileType.Member, userId, firstname, lastname)
        { }

        private Member()
        {

        }
    }
}
