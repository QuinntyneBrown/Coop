using System;

namespace Coop.Api.Models
{
    public class StaffMember: Profile
    {
        public Guid StaffMemberId { get; private set; }
        public string JobTitle { get; private set; }

        public StaffMember(Guid userId, string jobTitle, string firstname, string lastname)
            : base(ProfileType.Member, userId, firstname, lastname)
        {
            JobTitle = jobTitle;
        }

        private StaffMember()
        {

        }
    }
}
