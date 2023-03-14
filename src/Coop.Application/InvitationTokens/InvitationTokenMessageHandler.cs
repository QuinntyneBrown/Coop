// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain.DomainEvents;
using Coop.Domain.DomainEvents.InvitationToken;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features.InvitationTokens;

public class InvitationTokenMessageHandler : INotificationHandler<ValidateInvitationToken>
{
    private readonly ICoopDbContext _context;
    private readonly IOrchestrationHandler _messageHandlerContext;
    public InvitationTokenMessageHandler(ICoopDbContext context, IOrchestrationHandler messageHandlerContext)
    {
        _context = context;
        _messageHandlerContext = messageHandlerContext;
    }
    public async Task Handle(ValidateInvitationToken notification, CancellationToken cancellationToken)
    {
        var invitationToken = _context.InvitationTokens
            .SingleOrDefault((x => (x.Expiry == null || x.Expiry.Value > DateTime.UtcNow) && x.Value == notification.InvitationToken));
        var i = _context.InvitationTokens.ToList();
        await _messageHandlerContext.Publish(new ValidatedInvitationToken()
        {
            IsValid = invitationToken != null,
            InvitationTokenType = invitationToken?.Type.ToString()
        });
    }
}

