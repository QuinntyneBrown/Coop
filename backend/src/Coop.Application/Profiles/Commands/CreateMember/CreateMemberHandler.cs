using System.Security.Claims;
using Coop.Application.Common;
using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using Coop.Domain.Profiles;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace Coop.Application.Profiles.Commands.CreateMember;

public class CreateMemberHandler : IRequestHandler<CreateMemberRequest, CreateMemberResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IAuthorizationService _authorization;
    private readonly ClaimsPrincipal _user;

    public CreateMemberHandler(ICoopDbContext context, IAuthorizationService authorization, ClaimsPrincipal user)
    {
        _context = context;
        _authorization = authorization;
        _user = user;
    }

    public async Task<CreateMemberResponse> Handle(CreateMemberRequest request, CancellationToken cancellationToken)
    {
        // A member creates a profile only for themselves, as in onboarding (L2-REQ-114).
        var userId = await ProfileAccess.IsOfficeAsync(_authorization, _user) ? request.UserId : CallerAccess.UserId(_user);

        var member = new Member
        {
            UserId = userId,
            Firstname = request.Firstname,
            Lastname = request.Lastname,
            PhoneNumber = request.PhoneNumber,
            Email = request.Email,
            UnitNumber = request.UnitNumber
        };

        _context.Members.Add(member);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateMemberResponse { Member = MemberDto.FromMember(member) };
    }
}
