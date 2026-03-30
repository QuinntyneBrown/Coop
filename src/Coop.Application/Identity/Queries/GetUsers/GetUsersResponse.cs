using Coop.Application.Identity.Dtos;

namespace Coop.Application.Identity.Queries.GetUsers;

public class GetUsersResponse
{
    public List<UserDto> Users { get; set; } = new();
}
