using Coop.Domain.Profiles;

namespace Coop.Application.Profiles.Dtos;

public class MemberDto : ProfileDto
{
    public string? UnitNumber { get; set; }

    public static MemberDto FromMember(Member member)
    {
        return new MemberDto
        {
            ProfileId = member.ProfileId,
            UserId = member.UserId,
            Firstname = member.Firstname,
            Lastname = member.Lastname,
            PhoneNumber = member.PhoneNumber,
            Email = member.Email,
            AvatarDigitalAssetId = member.AvatarDigitalAssetId,
            Type = member.Type,
            Fullname = member.Fullname,
            UnitNumber = member.UnitNumber
        };
    }
}
