using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetMembersRequest : IRequest<GetMembersResponse> { }
public class GetMembersResponse : ResponseBase
{
    public List<MemberDto> Members { get; set; }
}
public class GetMembersHandler : IRequestHandler<GetMembersRequest, GetMembersResponse>
{
    private readonly ICoopDbContext _context;
    public GetMembersHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetMembersResponse> Handle(GetMembersRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Members = await _context.Members.Select(x => x.ToDto()).ToListAsync()
        };
    }
}
