using Coop.Domain.Identity;
using MediatR;

namespace Coop.Application.Privileges.Commands.UpdatePrivilege;

public class UpdatePrivilegeRequest : IRequest<UpdatePrivilegeResponse>
{
    public Guid PrivilegeId { get; set; }
    public AccessRight AccessRight { get; set; }
    public string Aggregate { get; set; } = string.Empty;
}
