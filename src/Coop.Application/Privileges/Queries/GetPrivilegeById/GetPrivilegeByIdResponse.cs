using Coop.Application.Identity.Dtos;

namespace Coop.Application.Privileges.Queries.GetPrivilegeById;

public class GetPrivilegeByIdResponse
{
    public PrivilegeDto Privilege { get; set; } = default!;
}
