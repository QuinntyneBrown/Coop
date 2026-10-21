using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Privileges.Queries.GetPrivilegesPage;

[OfficeOnly]
public class GetPrivilegesPageRequest : IRequest<GetPrivilegesPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
