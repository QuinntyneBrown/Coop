using Coop.Application.Identity.Dtos;

namespace Coop.Application.Privileges.Commands.CreatePrivilege;

public class CreatePrivilegeResponse
{
    public PrivilegeDto Privilege { get; set; } = default!;
}
