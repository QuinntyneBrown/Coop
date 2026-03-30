using Coop.Application.Common.Interfaces;
using Coop.Application.Onboarding.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Onboarding.Queries.GetInvitationTokens;

public class GetInvitationTokensHandler : IRequestHandler<GetInvitationTokensRequest, GetInvitationTokensResponse>
{
    private readonly ICoopDbContext _context;
    public GetInvitationTokensHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetInvitationTokensResponse> Handle(GetInvitationTokensRequest request, CancellationToken cancellationToken)
    {
        var ts = await _context.InvitationTokens.Where(t => !t.IsDeleted).ToListAsync(cancellationToken);
        return new GetInvitationTokensResponse { InvitationTokens = ts.Select(InvitationTokenDto.FromInvitationToken).ToList() };
    }
}
