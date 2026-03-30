using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Commands.UpdateBoardMember;

public class UpdateBoardMemberHandler : IRequestHandler<UpdateBoardMemberRequest, UpdateBoardMemberResponse>
{
    private readonly ICoopDbContext _context;

    public UpdateBoardMemberHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<UpdateBoardMemberResponse> Handle(UpdateBoardMemberRequest request, CancellationToken cancellationToken)
    {
        var boardMember = await _context.BoardMembers.SingleAsync(b => b.ProfileId == request.ProfileId, cancellationToken);

        boardMember.Firstname = request.Firstname;
        boardMember.Lastname = request.Lastname;
        boardMember.PhoneNumber = request.PhoneNumber;
        boardMember.Email = request.Email;
        boardMember.Title = request.Title;
        boardMember.BoardTitle = request.BoardTitle;

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateBoardMemberResponse { BoardMember = BoardMemberDto.FromBoardMember(boardMember) };
    }
}
