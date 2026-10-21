using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Roles.Commands.UpdateRole;

[OfficeOnly]
public class UpdateRoleRequest : IRequest<UpdateRoleResponse>
{
    public Guid RoleId { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<Guid> PrivilegeIds { get; set; } = new();
}
