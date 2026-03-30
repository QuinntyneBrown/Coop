using Coop.Application.Identity.Dtos;

namespace Coop.Application.Privileges.Queries.GetPrivileges;

public class GetPrivilegesResponse
{
    public List<PrivilegeDto> Privileges { get; set; } = new();
}
