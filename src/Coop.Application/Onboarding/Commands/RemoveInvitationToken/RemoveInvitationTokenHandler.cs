using Coop.Application.Common.Interfaces;
using Coop.Application.Onboarding.Dtos;
using Coop.Domain.Onboarding;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Onboarding.Commands.RemoveInvitationToken;

public class RemoveInvitationTokenHandler : IRequestHandler<RemoveInvitationTokenRequest, RemoveInvitationTokenResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveInvitationTokenHandler(ICoopDbContext context) { _context = context; }

    public async Task<RemoveInvitationTokenResponse> Handle(RemoveInvitationTokenRequest request, CancellationToken cancellationToken)
    {
        var token = await _context.InvitationTokens.SingleAsync(t => t.InvitationTokenId == request.InvitationTokenId, cancellationToken);
        token.Delete();
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveInvitationTokenResponse { InvitationToken = InvitationTokenDto.FromInvitationToken(token) };
    }
}
