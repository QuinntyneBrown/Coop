using Coop.Application.Common.Interfaces;
using Coop.Application.Onboarding.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Onboarding.Queries.GetInvitationTokenById;

public class GetInvitationTokenByIdHandler : IRequestHandler<GetInvitationTokenByIdRequest, GetInvitationTokenByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetInvitationTokenByIdHandler(ICoopDbContext context) { _context = context; }

    public async Task<GetInvitationTokenByIdResponse> Handle(GetInvitationTokenByIdRequest request, CancellationToken cancellationToken)
    {
        var t = await _context.InvitationTokens.SingleAsync(x => x.InvitationTokenId == request.InvitationTokenId, cancellationToken);
        return new GetInvitationTokenByIdResponse { InvitationToken = InvitationTokenDto.FromInvitationToken(t) };
    }
}
