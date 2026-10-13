using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Identity.Queries.GetUserById;

public class GetUserByIdHandler : IRequestHandler<GetUserByIdRequest, GetUserByIdResponse>
{
    private readonly ICoopDbContext _context;

    public GetUserByIdHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetUserByIdResponse> Handle(GetUserByIdRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .ThenInclude(r => r.Privileges)
            .SingleAsync(u => u.UserId == request.UserId, cancellationToken);

        return new GetUserByIdResponse
        {
            User = UserDto.FromUser(user)
        };
    }
}
