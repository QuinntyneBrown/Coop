using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetMemberByIdRequest : IRequest<GetMemberByIdResponse>
{
    public Guid MemberId { get; set; }
}
public class GetMemberByIdResponse : ResponseBase
{
    public MemberDto Member { get; set; }
}
public class GetMemberByIdHandler : IRequestHandler<GetMemberByIdRequest, GetMemberByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetMemberByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetMemberByIdResponse> Handle(GetMemberByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Member = (await _context.Members.SingleOrDefaultAsync(x => x.MemberId == request.MemberId)).ToDto()
        };
    }
}
