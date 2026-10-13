using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using Coop.Domain.Profiles;
using MediatR;

namespace Coop.Application.Profiles.Commands.CreateMember;

public class CreateMemberHandler : IRequestHandler<CreateMemberRequest, CreateMemberResponse>
{
    private readonly ICoopDbContext _context;

    public CreateMemberHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<CreateMemberResponse> Handle(CreateMemberRequest request, CancellationToken cancellationToken)
    {
        var member = new Member
        {
            UserId = request.UserId,
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
