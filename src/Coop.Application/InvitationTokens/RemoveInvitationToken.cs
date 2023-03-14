// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class RemoveInvitationTokenRequest : IRequest<RemoveInvitationTokenResponse>
{
    public Guid InvitationTokenId { get; set; }
}
public class RemoveInvitationTokenResponse : ResponseBase
{
    public InvitationTokenDto InvitationToken { get; set; }
}
public class RemoveInvitationTokenHandler : IRequestHandler<RemoveInvitationTokenRequest, RemoveInvitationTokenResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveInvitationTokenHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveInvitationTokenResponse> Handle(RemoveInvitationTokenRequest request, CancellationToken cancellationToken)
    {
        var invitationToken = await _context.InvitationTokens.SingleAsync(x => x.InvitationTokenId == request.InvitationTokenId);
        _context.InvitationTokens.Remove(invitationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveInvitationTokenResponse()
        {
            InvitationToken = invitationToken.ToDto()
        };
    }
}

