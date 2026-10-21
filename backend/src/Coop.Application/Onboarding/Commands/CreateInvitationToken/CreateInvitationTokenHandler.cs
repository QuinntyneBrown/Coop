using Coop.Application.Common.Interfaces;
using Coop.Application.Onboarding.Dtos;
using Coop.Domain.Onboarding;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Onboarding.Commands.CreateInvitationToken;

public class CreateInvitationTokenHandler : IRequestHandler<CreateInvitationTokenRequest, CreateInvitationTokenResponse>
{
    private readonly ICoopDbContext _context;
    public CreateInvitationTokenHandler(ICoopDbContext context) { _context = context; }

    public async Task<CreateInvitationTokenResponse> Handle(CreateInvitationTokenRequest request, CancellationToken cancellationToken)
    {
        // A repeated create returns the token that already has the value, unchanged (ADR 0015).
        var existing = await _context.InvitationTokens.FirstOrDefaultAsync(t => t.Value == request.Value && !t.IsDeleted, cancellationToken);
        if (existing != null)
            return new CreateInvitationTokenResponse { InvitationToken = InvitationTokenDto.FromInvitationToken(existing) };

        var token = new InvitationToken { Value = request.Value, Type = request.Type, ExpirationDate = request.ExpirationDate };
        _context.InvitationTokens.Add(token);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateInvitationTokenResponse { InvitationToken = InvitationTokenDto.FromInvitationToken(token) };
    }
}
