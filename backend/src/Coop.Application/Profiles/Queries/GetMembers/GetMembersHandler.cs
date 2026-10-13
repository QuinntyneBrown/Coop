using Coop.Application.Common.Interfaces;
using Coop.Application.Profiles.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Profiles.Queries.GetMembers;

public class GetMembersHandler : IRequestHandler<GetMembersRequest, GetMembersResponse>
{
    private readonly ICoopDbContext _context;

    public GetMembersHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetMembersResponse> Handle(GetMembersRequest request, CancellationToken cancellationToken)
    {
        var members = await _context.Members.Where(m => !m.IsDeleted).ToListAsync(cancellationToken);
        return new GetMembersResponse { Members = members.Select(MemberDto.FromMember).ToList() };
    }
}
