using MediatR;

namespace Coop.Application.Identity.Commands.CreateUser;

public class CreateUserRequest : IRequest<CreateUserResponse>
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public List<Guid> RoleIds { get; set; } = new();
}
