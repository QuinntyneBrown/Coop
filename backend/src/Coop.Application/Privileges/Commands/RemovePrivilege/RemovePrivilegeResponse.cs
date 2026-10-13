using Coop.Application.Identity.Dtos;

namespace Coop.Application.Privileges.Commands.RemovePrivilege;

public class RemovePrivilegeResponse
{
    public PrivilegeDto Privilege { get; set; } = default!;
}
