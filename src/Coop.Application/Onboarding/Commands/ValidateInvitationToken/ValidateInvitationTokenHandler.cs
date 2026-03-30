using Coop.Application.Common.Interfaces;
using Coop.Application.Onboarding.Dtos;
using Coop.Domain.Onboarding;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Onboarding.Commands.ValidateInvitationToken;

public class ValidateInvitationTokenHandler : IRequestHandler<ValidateInvitationTokenRequest, ValidateInvitationTokenResponse>
{
    private readonly ICoopDbContext _context;
    public ValidateInvitationTokenHandler(ICoopDbContext context) { _context = context; }

    public async Task<ValidateInvitationTokenResponse> Handle(ValidateInvitationTokenRequest request, CancellationToken cancellationToken)
    {
        var token = await _context.InvitationTokens.FirstOrDefaultAsync(t => t.Value == request.Value && !t.IsDeleted, cancellationToken);
        return new ValidateInvitationTokenResponse { Success = token != null && token.IsValid() };
    }
}
