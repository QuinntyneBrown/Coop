using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Profiles.Queries.GetProfilesPage;

[OfficeOnly]
public class GetProfilesPageRequest : IRequest<GetProfilesPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
