using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class GetUsersRequest : IRequest<GetUsersResponse> { }
public class GetUsersResponse : ResponseBase
{
    public List<UserDto> Users { get; set; }
}
public class GetUsersHandler : IRequestHandler<GetUsersRequest, GetUsersResponse>
{
    private readonly ICoopDbContext _context;
    public GetUsersHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetUsersResponse> Handle(GetUsersRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Users = await _context.Users
            .Include(x => x.Profiles)
            .Include(x => x.Roles)
            .Include("Roles.Privileges")
            .Select(x => x.ToDto()).ToListAsync()
        };
    }
}
