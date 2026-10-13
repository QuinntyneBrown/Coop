using MediatR;

namespace Coop.Application.Identity.Commands.UpdateUser;

public class UpdateUserRequest : IRequest<UpdateUserResponse>
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public List<Guid> RoleIds { get; set; } = new();
}
