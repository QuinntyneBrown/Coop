using MediatR;

namespace Coop.Application.Identity.Commands.AddUserRole;

/// <summary>Adds one role to a user; a role the user already holds changes nothing (L2-REQ-013 AC1).</summary>
public class AddUserRoleRequest : IRequest<AddUserRoleResponse>
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
}
