using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetPrivilegeByIdRequest : IRequest<GetPrivilegeByIdResponse>
{
    public Guid PrivilegeId { get; set; }
}
public class GetPrivilegeByIdResponse : ResponseBase
{
    public PrivilegeDto Privilege { get; set; }
}
public class GetPrivilegeByIdHandler : IRequestHandler<GetPrivilegeByIdRequest, GetPrivilegeByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetPrivilegeByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetPrivilegeByIdResponse> Handle(GetPrivilegeByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Privilege = (await _context.Privileges.SingleOrDefaultAsync(x => x.PrivilegeId == request.PrivilegeId)).ToDto()
        };
    }
}
