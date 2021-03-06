using Coop.Core.Models;

namespace Coop.Api.Features
{
    public static class StaffMemberExtensions
    {
        public static StaffMemberDto ToDto(this StaffMember staffMember)
        {
            return new()
            {
                StaffMemberId = staffMember.StaffMemberId,
                ProfileId = staffMember.ProfileId,
                JobTitle = staffMember.JobTitle,
                Firstname = staffMember.Firstname,
                Lastname = staffMember.Lastname,
                PhoneNumber = staffMember.PhoneNumber,
                AvatarDigitalAssetId = staffMember.AvatarDigitalAssetId
            };
        }

    }
}
