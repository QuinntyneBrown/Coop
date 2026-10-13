using Coop.Domain.Profiles;

namespace Coop.Application.Profiles.Dtos;

public class StaffMemberDto : ProfileDto
{
    public string? JobTitle { get; set; }

    public static StaffMemberDto FromStaffMember(StaffMember staffMember)
    {
        return new StaffMemberDto
        {
            ProfileId = staffMember.ProfileId,
            UserId = staffMember.UserId,
            Firstname = staffMember.Firstname,
            Lastname = staffMember.Lastname,
            PhoneNumber = staffMember.PhoneNumber,
            Email = staffMember.Email,
            AvatarDigitalAssetId = staffMember.AvatarDigitalAssetId,
            Type = staffMember.Type,
            Fullname = staffMember.Fullname,
            JobTitle = staffMember.JobTitle
        };
    }
}
