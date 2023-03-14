// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class UpdateInvitationTokenExpiryRequest : IRequest<UpdateInvitationTokenExpiryResponse>
{
    public Guid InvitationTokenId { get; set; }
    public DateTime? Expiry { get; set; }
}
public class UpdateInvitationTokenExpiryResponse : ResponseBase
{
    public InvitationTokenDto InvitationToken { get; set; }
}
public class UpdateInvitationTokenExpiryHandler : IRequestHandler<UpdateInvitationTokenExpiryRequest, UpdateInvitationTokenExpiryResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateInvitationTokenExpiryHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateInvitationTokenExpiryResponse> Handle(UpdateInvitationTokenExpiryRequest request, CancellationToken cancellationToken)
    {
        var invitationToken = await _context.InvitationTokens.SingleAsync(x => x.InvitationTokenId == request.InvitationTokenId);
        invitationToken.UpdateExpiry(request.Expiry);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            InvitationToken = invitationToken.ToDto()
        };
    }
}

