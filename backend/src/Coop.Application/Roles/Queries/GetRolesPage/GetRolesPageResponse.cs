using Coop.Application.Identity.Dtos;

namespace Coop.Application.Roles.Queries.GetRolesPage;

public class GetRolesPageResponse
{
    public List<RoleDto> Roles { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
