using MediatR;

namespace Coop.Application.Privileges.Commands.RemovePrivilege;

public class RemovePrivilegeRequest : IRequest<RemovePrivilegeResponse>
{
    public Guid PrivilegeId { get; set; }
}
