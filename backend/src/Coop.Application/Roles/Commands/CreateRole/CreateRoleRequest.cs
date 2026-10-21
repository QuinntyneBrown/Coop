using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Roles.Commands.CreateRole;

[OfficeOnly]
public class CreateRoleRequest : IRequest<CreateRoleResponse>
{
    public string Name { get; set; } = string.Empty;
}
