using MediatR;

namespace Coop.Application.Identity.Queries.GetUsersPage;

public class GetUsersPageRequest : IRequest<GetUsersPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
