using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Queries.GetMemberById;

public class GetMemberByIdHandler : IRequestHandler<GetMemberByIdRequest, GetMemberByIdResponse>
{
    private readonly ICoopDbContext _context;

    public GetMemberByIdHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetMemberByIdResponse> Handle(GetMemberByIdRequest request, CancellationToken cancellationToken)
    {
        var member = await _context.Members.SingleAsync(m => m.ProfileId == request.ProfileId, cancellationToken);
        return new GetMemberByIdResponse { Member = MemberDto.FromMember(member) };
    }
}
