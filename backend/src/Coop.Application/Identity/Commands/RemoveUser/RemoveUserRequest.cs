using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Identity.Commands.RemoveUser;

[OfficeOnly]
public class RemoveUserRequest : IRequest<RemoveUserResponse>
{
    public Guid UserId { get; set; }
}
