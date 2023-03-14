using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetUserByIdRequest : IRequest<GetUserByIdResponse>
{
    public Guid UserId { get; set; }
}
public class GetUserByIdResponse : ResponseBase
{
    public UserDto User { get; set; }
}
public class GetUserByIdHandler : IRequestHandler<GetUserByIdRequest, GetUserByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetUserByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetUserByIdResponse> Handle(GetUserByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            User = (await _context.Users
            .Include(x => x.Roles)
            .Include("Roles.Privileges")
            .SingleOrDefaultAsync(x => x.UserId == request.UserId)).ToDto()
        };
    }
}
