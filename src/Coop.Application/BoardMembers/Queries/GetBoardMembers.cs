using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.BoardMembers;

public class GetBoardMembersRequest : IRequest<GetBoardMembersResponse> { }
public class GetBoardMembersResponse : ResponseBase
{
    public List<BoardMemberDto> BoardMembers { get; set; }
}
public class GetBoardMembersHandler : IRequestHandler<GetBoardMembersRequest, GetBoardMembersResponse>
{
    private readonly ICoopDbContext _context;
    public GetBoardMembersHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetBoardMembersResponse> Handle(GetBoardMembersRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            BoardMembers = await _context.BoardMembers.Select(x => x.ToDto()).ToListAsync()
        };
    }
}
