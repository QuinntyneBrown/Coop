using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity.Queries.GetUsers;

public class GetUsersHandler : IRequestHandler<GetUsersRequest, GetUsersResponse>
{
    private readonly ICoopDbContext _context;

    public GetUsersHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetUsersResponse> Handle(GetUsersRequest request, CancellationToken cancellationToken)
    {
        var users = await _context.Users
            .Include(u => u.Roles)
            .ThenInclude(r => r.Privileges)
            .Where(u => !u.IsDeleted)
            .ToListAsync(cancellationToken);

        return new GetUsersResponse
        {
            Users = users.Select(UserDto.FromUser).ToList()
        };
    }
}
