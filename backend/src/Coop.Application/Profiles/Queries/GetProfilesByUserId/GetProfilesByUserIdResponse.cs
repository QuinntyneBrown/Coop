using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Queries.GetProfilesByUserId;

public class GetProfilesByUserIdResponse
{
    public List<ProfileDto> Profiles { get; set; } = new();
}
