using Coop.Api.Models;

namespace Coop.Api.Features
{
    public static class ProfileExtensions
    {
        public static ProfileDto ToDto(this Profile profile)
            => profile.Type switch
            {
                ProfileType.BoardMember => (profile as BoardMember).ToDto(),
                ProfileType.StaffMember => (profile as StaffMember).ToDto(),
                ProfileType.Member => (profile as Member).ToDto(),
                _ => new ()
                {
                    ProfileId = profile.ProfileId,
                    Type = profile.Type,
                    Firstname = profile.Firstname,
                    Lastname = profile.Lastname,
                    PhoneNumber = profile.PhoneNumber,
                    AvatarDigitalAssetId = profile.AvatarDigitalAssetId
                }
            };

    }
}
