using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Roles.Queries.GetRolesPage;

[OfficeOnly]
public class GetRolesPageRequest : IRequest<GetRolesPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
