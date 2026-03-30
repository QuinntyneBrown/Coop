using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Commands.DeleteProfile;

public class DeleteProfileResponse
{
    public ProfileDto Profile { get; set; } = default!;
}
