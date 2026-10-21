using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Privileges.Commands.RemovePrivilege;

[OfficeOnly]
public class RemovePrivilegeRequest : IRequest<RemovePrivilegeResponse>
{
    public Guid PrivilegeId { get; set; }
}
