using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity.Queries.GetUsersPage;

public class GetUsersPageHandler : IRequestHandler<GetUsersPageRequest, GetUsersPageResponse>
{
    private readonly ICoopDbContext _context;

    public GetUsersPageHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetUsersPageResponse> Handle(GetUsersPageRequest request, CancellationToken cancellationToken)
    {
        var query = _context.Users
            .Include(u => u.Roles)
            .Where(u => !u.IsDeleted);

        var totalCount = await query.CountAsync(cancellationToken);

        var users = await query
            .Skip(request.Index * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new GetUsersPageResponse
        {
            Users = users.Select(UserDto.FromUser).ToList(),
            TotalCount = totalCount,
            PageSize = request.PageSize,
            PageIndex = request.Index
        };
    }
}
