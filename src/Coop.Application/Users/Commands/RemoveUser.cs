using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class RemoveUserRequest : IRequest<RemoveUserResponse>
{
    public Guid UserId { get; set; }
}
public class RemoveUserResponse : ResponseBase
{
    public UserDto User { get; set; }
}
public class RemoveUserHandler : IRequestHandler<RemoveUserRequest, RemoveUserResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveUserHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveUserResponse> Handle(RemoveUserRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.SingleAsync(x => x.UserId == request.UserId);
        user.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            User = user.ToDto()
        };
    }
}
