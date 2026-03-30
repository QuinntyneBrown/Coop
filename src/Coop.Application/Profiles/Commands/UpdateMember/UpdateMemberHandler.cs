using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Commands.UpdateMember;

public class UpdateMemberHandler : IRequestHandler<UpdateMemberRequest, UpdateMemberResponse>
{
    private readonly ICoopDbContext _context;

    public UpdateMemberHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<UpdateMemberResponse> Handle(UpdateMemberRequest request, CancellationToken cancellationToken)
    {
        var member = await _context.Members.SingleAsync(m => m.ProfileId == request.ProfileId, cancellationToken);

        member.Firstname = request.Firstname;
        member.Lastname = request.Lastname;
        member.PhoneNumber = request.PhoneNumber;
        member.Email = request.Email;
        member.UnitNumber = request.UnitNumber;

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateMemberResponse { Member = MemberDto.FromMember(member) };
    }
}
