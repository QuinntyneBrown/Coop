using Coop.Application.Profiles.Dtos;

namespace Coop.Application.Profiles.Queries.GetProfilesPage;

public class GetProfilesPageResponse
{
    public List<ProfileDto> Profiles { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
