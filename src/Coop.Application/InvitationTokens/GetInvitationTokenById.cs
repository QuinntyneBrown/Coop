using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetInvitationTokenByIdRequest : IRequest<GetInvitationTokenByIdResponse>
{
    public Guid InvitationTokenId { get; set; }
}
public class GetInvitationTokenByIdResponse : ResponseBase
{
    public InvitationTokenDto InvitationToken { get; set; }
}
public class GetInvitationTokenByIdHandler : IRequestHandler<GetInvitationTokenByIdRequest, GetInvitationTokenByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetInvitationTokenByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetInvitationTokenByIdResponse> Handle(GetInvitationTokenByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            InvitationToken = (await _context.InvitationTokens.SingleOrDefaultAsync(x => x.InvitationTokenId == request.InvitationTokenId)).ToDto()
        };
    }
}
