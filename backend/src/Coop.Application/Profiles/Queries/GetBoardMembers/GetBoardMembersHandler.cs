using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Queries.GetBoardMembers;

public class GetBoardMembersHandler : IRequestHandler<GetBoardMembersRequest, GetBoardMembersResponse>
{
    private readonly ICoopDbContext _context;

    public GetBoardMembersHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetBoardMembersResponse> Handle(GetBoardMembersRequest request, CancellationToken cancellationToken)
    {
        var boardMembers = await _context.BoardMembers.Where(b => !b.IsDeleted).ToListAsync(cancellationToken);
        return new GetBoardMembersResponse { BoardMembers = boardMembers.Select(BoardMemberDto.FromBoardMember).ToList() };
    }
}
