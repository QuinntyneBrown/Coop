using System.Security.Claims;
using Coop.Application.Common;
using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Commands.UpdateMember;

public class UpdateMemberHandler : IRequestHandler<UpdateMemberRequest, UpdateMemberResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;

    public UpdateMemberHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user)
    {
        _context = context;
        _authorization = authorization;
        _user = user;
    }

    public async Task<UpdateMemberResponse> Handle(UpdateMemberRequest request, CancellationToken cancellationToken)
    {
        var member = await _context.Members.SingleAsync(m => m.ProfileId == request.ProfileId, cancellationToken);

        // A member changes only their own profile (L2-REQ-106).
        if (member.UserId != CallerAccess.UserId(_user) && !await ProfileAccess.IsOfficeAsync(_authorization, _user))
            throw new UnauthorizedAccessException("Access denied.");

        member.Firstname = request.Firstname;
        member.Lastname = request.Lastname;
        member.PhoneNumber = request.PhoneNumber;
        member.Email = request.Email;
        member.UnitNumber = request.UnitNumber;

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateMemberResponse { Member = MemberDto.FromMember(member) };
    }
}
