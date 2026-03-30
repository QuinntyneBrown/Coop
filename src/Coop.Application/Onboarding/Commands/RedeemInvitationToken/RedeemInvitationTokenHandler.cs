using Coop.Application.Common.Interfaces;
using Coop.Application.Onboarding.Dtos;
using Coop.Domain.Onboarding;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Onboarding.Commands.RedeemInvitationToken;

public class RedeemInvitationTokenHandler : IRequestHandler<RedeemInvitationTokenRequest, RedeemInvitationTokenResponse>
{
    private readonly ICoopDbContext _context;
    public RedeemInvitationTokenHandler(ICoopDbContext context) { _context = context; }

    public async Task<RedeemInvitationTokenResponse> Handle(RedeemInvitationTokenRequest request, CancellationToken cancellationToken)
    {
        var token = await _context.InvitationTokens.FirstAsync(t => t.Value == request.Value && !t.IsDeleted, cancellationToken);
        token.Redeem();
        await _context.SaveChangesAsync(cancellationToken);
        return new RedeemInvitationTokenResponse { Success = true };
    }
}
