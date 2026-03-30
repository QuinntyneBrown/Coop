using Coop.Application.Common.Interfaces;
using Coop.Application.Onboarding.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Onboarding.Queries.GetInvitationTokenByValue;

public class GetInvitationTokenByValueHandler : IRequestHandler<GetInvitationTokenByValueRequest, GetInvitationTokenByValueResponse>
{
    private readonly ICoopDbContext _context;
    public GetInvitationTokenByValueHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetInvitationTokenByValueResponse> Handle(GetInvitationTokenByValueRequest request, CancellationToken cancellationToken)
    {
        var t = await _context.InvitationTokens.FirstOrDefaultAsync(x => x.Value == request.Value && !x.IsDeleted, cancellationToken);
        return new GetInvitationTokenByValueResponse { InvitationToken = t != null ? InvitationTokenDto.FromInvitationToken(t) : null };
    }
}
