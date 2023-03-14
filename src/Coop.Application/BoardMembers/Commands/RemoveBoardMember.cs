using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.BoardMembers;

public class RemoveBoardMemberRequest : IRequest<RemoveBoardMemberResponse>
{
    public Guid ProfileId { get; set; }
}
public class RemoveBoardMemberResponse : ResponseBase
{
    public BoardMemberDto BoardMember { get; set; }
}
public class RemoveBoardMemberHandler : IRequestHandler<RemoveBoardMemberRequest, RemoveBoardMemberResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveBoardMemberHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveBoardMemberResponse> Handle(RemoveBoardMemberRequest request, CancellationToken cancellationToken)
    {
        var boardMember = await _context.BoardMembers.SingleAsync(x => x.ProfileId == request.ProfileId);
        _context.BoardMembers.Remove(boardMember);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveBoardMemberResponse()
        {
            BoardMember = boardMember.ToDto()
        };
    }
}
