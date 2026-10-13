using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Queries.GetBoardMemberById;

public class GetBoardMemberByIdHandler : IRequestHandler<GetBoardMemberByIdRequest, GetBoardMemberByIdResponse>
{
    private readonly ICoopDbContext _context;

    public GetBoardMemberByIdHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetBoardMemberByIdResponse> Handle(GetBoardMemberByIdRequest request, CancellationToken cancellationToken)
    {
        var boardMember = await _context.BoardMembers.SingleAsync(b => b.ProfileId == request.ProfileId, cancellationToken);
        return new GetBoardMemberByIdResponse { BoardMember = BoardMemberDto.FromBoardMember(boardMember) };
    }
}
