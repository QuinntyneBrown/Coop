using MediatR;

namespace Coop.Application.Roles.Commands.RemoveRole;

public class RemoveRoleRequest : IRequest<RemoveRoleResponse>
{
    public Guid RoleId { get; set; }
}
