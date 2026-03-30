using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using Coop.Domain.Profiles;
using MediatR;

namespace Coop.Application.Profiles.Commands.CreateBoardMember;

public class CreateBoardMemberHandler : IRequestHandler<CreateBoardMemberRequest, CreateBoardMemberResponse>
{
    private readonly ICoopDbContext _context;

    public CreateBoardMemberHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<CreateBoardMemberResponse> Handle(CreateBoardMemberRequest request, CancellationToken cancellationToken)
    {
        var boardMember = new BoardMember
        {
            UserId = request.UserId,
            Firstname = request.Firstname,
            Lastname = request.Lastname,
            PhoneNumber = request.PhoneNumber,
            Email = request.Email,
            Title = request.Title,
            BoardTitle = request.BoardTitle
        };

        _context.BoardMembers.Add(boardMember);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateBoardMemberResponse { BoardMember = BoardMemberDto.FromBoardMember(boardMember) };
    }
}
