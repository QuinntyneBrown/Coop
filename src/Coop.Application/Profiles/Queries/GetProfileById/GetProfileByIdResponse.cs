using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Queries.GetProfileById;

public class GetProfileByIdResponse
{
    public ProfileDto Profile { get; set; } = default!;
}
