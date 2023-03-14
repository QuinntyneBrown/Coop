using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.BoardMembers;

public class GetBoardMemberByIdRequest : IRequest<GetBoardMemberByIdResponse>
{
    public Guid BoardMemberId { get; set; }
}
public class GetBoardMemberByIdResponse : ResponseBase
{
    public BoardMemberDto BoardMember { get; set; }
}
public class GetBoardMemberByIdHandler : IRequestHandler<GetBoardMemberByIdRequest, GetBoardMemberByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetBoardMemberByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetBoardMemberByIdResponse> Handle(GetBoardMemberByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            BoardMember = (await _context.BoardMembers.SingleOrDefaultAsync(x => x.ProfileId == request.BoardMemberId)).ToDto()
        };
    }
}
