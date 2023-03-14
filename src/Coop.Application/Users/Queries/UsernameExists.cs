using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class UsernameExistsRequest : IRequest<UsernameExistsResponse>
{
    public string Username { get; set; }
}
public class UsernameExistsResponse : ResponseBase
{
    public bool Exists { get; set; }
}
public class UsernameExistsHandler : IRequestHandler<UsernameExistsRequest, UsernameExistsResponse>
{
    private readonly ICoopDbContext _context;
    public UsernameExistsHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UsernameExistsResponse> Handle(UsernameExistsRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Exists = (await _context.Users.SingleOrDefaultAsync(x => x.Username == request.Username)) != null
        };
    }
}
