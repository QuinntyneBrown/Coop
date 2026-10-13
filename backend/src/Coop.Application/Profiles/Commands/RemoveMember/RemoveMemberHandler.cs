using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Commands.RemoveMember;

public class RemoveMemberHandler : IRequestHandler<RemoveMemberRequest, RemoveMemberResponse>
{
    private readonly ICoopDbContext _context;

    public RemoveMemberHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<RemoveMemberResponse> Handle(RemoveMemberRequest request, CancellationToken cancellationToken)
    {
        var member = await _context.Members.SingleAsync(m => m.ProfileId == request.ProfileId, cancellationToken);
        member.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveMemberResponse { Member = MemberDto.FromMember(member) };
    }
}
