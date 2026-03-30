using Coop.Application.Identity.Dtos;

namespace Coop.Application.Identity.Queries.GetUserById;

public class GetUserByIdResponse
{
    public UserDto User { get; set; } = default!;
}
