using MediatR;

namespace Coop.Application.Roles.Commands.CreateRole;

public class CreateRoleRequest : IRequest<CreateRoleResponse>
{
    public string Name { get; set; } = string.Empty;
}
