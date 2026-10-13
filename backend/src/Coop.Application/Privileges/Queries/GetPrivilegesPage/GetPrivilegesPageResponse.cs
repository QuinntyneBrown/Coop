using Coop.Application.Identity.Dtos;

namespace Coop.Application.Privileges.Queries.GetPrivilegesPage;

public class GetPrivilegesPageResponse
{
    public List<PrivilegeDto> Privileges { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
