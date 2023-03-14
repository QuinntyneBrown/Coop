using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.Member).NotNull();
        RuleFor(request => request.Member).SetValidator(new MemberValidator());
    }
}
public class UpdateMemberRequest : IRequest<UpdateMemberResponse>
{
    public MemberDto Member { get; set; }
}
public class UpdateMemberResponse : ResponseBase
{
    public MemberDto Member { get; set; }
}
public class UpdateMemberHandler : IRequestHandler<UpdateMemberRequest, UpdateMemberResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateMemberHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateMemberResponse> Handle(UpdateMemberRequest request, CancellationToken cancellationToken)
    {
        var member = await _context.Members.SingleAsync(x => x.MemberId == request.Member.MemberId);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateMemberResponse()
        {
            Member = member.ToDto()
        };
    }
}
