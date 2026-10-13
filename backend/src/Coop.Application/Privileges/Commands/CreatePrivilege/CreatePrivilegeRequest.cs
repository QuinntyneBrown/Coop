using Coop.Domain.Identity;
using MediatR;

namespace Coop.Application.Privileges.Commands.CreatePrivilege;

public class CreatePrivilegeRequest : IRequest<CreatePrivilegeResponse>
{
    public Guid RoleId { get; set; }
    public AccessRight AccessRight { get; set; }
    public string Aggregate { get; set; } = string.Empty;
}
