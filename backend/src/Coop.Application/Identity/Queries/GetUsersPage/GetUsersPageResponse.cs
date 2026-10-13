using Coop.Application.Identity.Dtos;

namespace Coop.Application.Identity.Queries.GetUsersPage;

public class GetUsersPageResponse
{
    public List<UserDto> Users { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
}
