using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Identity.Commands.RemoveUserRole;

/// <summary>Removes one role from a user (L2-REQ-013 AC2).</summary>
[OfficeOnly]
public class RemoveUserRoleRequest : IRequest<RemoveUserRoleResponse>
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
}
