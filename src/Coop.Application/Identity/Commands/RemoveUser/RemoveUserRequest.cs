using MediatR;

namespace Coop.Application.Identity.Commands.RemoveUser;

public class RemoveUserRequest : IRequest<RemoveUserResponse>
{
    public Guid UserId { get; set; }
}
