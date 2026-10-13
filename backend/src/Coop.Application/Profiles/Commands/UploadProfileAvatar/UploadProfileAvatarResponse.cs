using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Commands.UploadProfileAvatar;

public class UploadProfileAvatarResponse
{
    public ProfileDto Profile { get; set; } = default!;
}
