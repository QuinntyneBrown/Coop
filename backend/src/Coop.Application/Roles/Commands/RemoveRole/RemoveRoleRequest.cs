using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Roles.Commands.RemoveRole;

[OfficeOnly]
public class RemoveRoleRequest : IRequest<RemoveRoleResponse>
{
    public Guid RoleId { get; set; }
}
