using Coop.Application.Identity.Dtos;

namespace Coop.Application.Privileges.Commands.UpdatePrivilege;

public class UpdatePrivilegeResponse
{
    public PrivilegeDto Privilege { get; set; } = default!;
}
