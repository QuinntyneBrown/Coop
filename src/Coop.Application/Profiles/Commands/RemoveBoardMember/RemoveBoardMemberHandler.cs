using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Commands.RemoveBoardMember;

public class RemoveBoardMemberHandler : IRequestHandler<RemoveBoardMemberRequest, RemoveBoardMemberResponse>
{
    private readonly ICoopDbContext _context;

    public RemoveBoardMemberHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<RemoveBoardMemberResponse> Handle(RemoveBoardMemberRequest request, CancellationToken cancellationToken)
    {
        var boardMember = await _context.BoardMembers.SingleAsync(b => b.ProfileId == request.ProfileId, cancellationToken);
        boardMember.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveBoardMemberResponse { BoardMember = BoardMemberDto.FromBoardMember(boardMember) };
    }
}
