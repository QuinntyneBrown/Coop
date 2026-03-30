using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Roles.Queries.GetRoleById;

public class GetRoleByIdHandler : IRequestHandler<GetRoleByIdRequest, GetRoleByIdResponse>
{
    private readonly ICoopDbContext _context;

    public GetRoleByIdHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetRoleByIdResponse> Handle(GetRoleByIdRequest request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles
            .Include(r => r.Privileges)
            .SingleAsync(r => r.RoleId == request.RoleId, cancellationToken);

        return new GetRoleByIdResponse { Role = RoleDto.FromRole(role) };
    }
}
