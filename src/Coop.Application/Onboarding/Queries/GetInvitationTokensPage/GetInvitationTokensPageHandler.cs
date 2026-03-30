using Coop.Application.Common.Interfaces;
using Coop.Application.Onboarding.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Onboarding.Queries.GetInvitationTokensPage;

public class GetInvitationTokensPageHandler : IRequestHandler<GetInvitationTokensPageRequest, GetInvitationTokensPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetInvitationTokensPageHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetInvitationTokensPageResponse> Handle(GetInvitationTokensPageRequest request, CancellationToken cancellationToken)
    {
        var q = _context.InvitationTokens.Where(t => !t.IsDeleted);
        var tc = await q.CountAsync(cancellationToken);
        var ts = await q.Skip(request.Index * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);
        return new GetInvitationTokensPageResponse { InvitationTokens = ts.Select(InvitationTokenDto.FromInvitationToken).ToList(), TotalCount = tc, PageSize = request.PageSize, PageIndex = request.Index };
    }
}
