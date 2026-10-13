using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Queries.GetProfiles;

public class GetProfilesResponse
{
    public List<ProfileDto> Profiles { get; set; } = new();
}
