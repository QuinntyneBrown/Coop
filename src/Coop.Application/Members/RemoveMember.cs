using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class RemoveMemberRequest : IRequest<RemoveMemberResponse>
{
    public Guid MemberId { get; set; }
}
public class RemoveMemberResponse : ResponseBase
{
    public MemberDto Member { get; set; }
}
public class RemoveMemberHandler : IRequestHandler<RemoveMemberRequest, RemoveMemberResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveMemberHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveMemberResponse> Handle(RemoveMemberRequest request, CancellationToken cancellationToken)
    {
        var member = await _context.Members.SingleAsync(x => x.MemberId == request.MemberId);
        _context.Members.Remove(member);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveMemberResponse()
        {
            Member = member.ToDto()
        };
    }
}
