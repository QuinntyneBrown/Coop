using Coop.Application.Identity.Dtos;

namespace Coop.Application.Identity.Queries.GetCurrentUser;

public class GetCurrentUserResponse
{
    public UserDto User { get; set; } = default!;
}
