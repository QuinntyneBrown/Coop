using Coop.Application.Common.Extensions;
using Coop.Domain.Enums;
using Coop.Domain.Entities;

namespace Coop.Application.Features
{
    public static class ProfileExtensions
    {
        public static ProfileDto ToDto(this Profile profile)
            => profile.Type switch
            {
                ProfileType.BoardMember => (profile as BoardMember).ToDto(),
                ProfileType.StaffMember => (profile as StaffMember).ToDto(),
                ProfileType.Member => (profile as Member).ToDto(),
                _ => new()
                {
                    ProfileId = profile.ProfileId,
                    Type = profile.Type,
                    Firstname = profile.Firstname,
                    Lastname = profile.Lastname,
                    PhoneNumber = profile.PhoneNumber,
                    AvatarDigitalAssetId = profile.AvatarDigitalAssetId,
                    Address = profile.Address.ToDto()
                }
            };

    }
}
