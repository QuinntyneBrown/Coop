using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Commands.SetProfileAvatar;

public class SetProfileAvatarResponse
{
    public ProfileDto Profile { get; set; } = default!;
}
