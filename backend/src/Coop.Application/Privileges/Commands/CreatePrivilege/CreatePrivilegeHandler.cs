using Coop.Application.Common.Interfaces;
using Coop.Application.Identity.Dtos;
using Coop.Domain.Identity;
using MediatR;

namespace Coop.Application.Privileges.Commands.CreatePrivilege;

public class CreatePrivilegeHandler : IRequestHandler<CreatePrivilegeRequest, CreatePrivilegeResponse>
{
    private readonly ICoopDbContext _context;

    public CreatePrivilegeHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<CreatePrivilegeResponse> Handle(CreatePrivilegeRequest request, CancellationToken cancellationToken)
    {
        var privilege = new Privilege
        {
            RoleId = request.RoleId,
            AccessRight = request.AccessRight,
            Aggregate = request.Aggregate
        };

        _context.Privileges.Add(privilege);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreatePrivilegeResponse { Privilege = PrivilegeDto.FromPrivilege(privilege) };
    }
}
