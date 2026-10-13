using MediatR;

namespace Coop.Application.Profiles.Queries.GetProfilesPage;

public class GetProfilesPageRequest : IRequest<GetProfilesPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
