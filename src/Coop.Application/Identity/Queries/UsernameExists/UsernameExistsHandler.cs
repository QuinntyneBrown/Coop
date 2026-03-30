using Coop.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity.Queries.UsernameExists;

public class UsernameExistsHandler : IRequestHandler<UsernameExistsRequest, UsernameExistsResponse>
{
    private readonly ICoopDbContext _context;

    public UsernameExistsHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<UsernameExistsResponse> Handle(UsernameExistsRequest request, CancellationToken cancellationToken)
    {
        var exists = await _context.Users
            .AnyAsync(u => u.Username == request.Username && !u.IsDeleted, cancellationToken);

        return new UsernameExistsResponse { Exists = exists };
    }
}
