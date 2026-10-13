using Coop.Application.Common.Interfaces;
using Coop.Application.Onboarding.Dtos;
using Coop.Domain.Onboarding;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Onboarding.Commands.UpdateInvitationToken;

public class UpdateInvitationTokenHandler : IRequestHandler<UpdateInvitationTokenRequest, UpdateInvitationTokenResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateInvitationTokenHandler(ICoopDbContext context) { _context = context; }

    public async Task<UpdateInvitationTokenResponse> Handle(UpdateInvitationTokenRequest request, CancellationToken cancellationToken)
    {
        var token = await _context.InvitationTokens.SingleAsync(t => t.InvitationTokenId == request.InvitationTokenId, cancellationToken);
        token.Value = request.Value;
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateInvitationTokenResponse { InvitationToken = InvitationTokenDto.FromInvitationToken(token) };
    }
}
