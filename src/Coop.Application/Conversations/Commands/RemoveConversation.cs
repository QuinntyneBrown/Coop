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

public class RemoveConversationRequest : IRequest<RemoveConversationResponse>
{
    public Guid ConversationId { get; set; }
}
public class RemoveConversationResponse : ResponseBase
{
    public ConversationDto Conversation { get; set; }
}
public class RemoveConversationHandler : IRequestHandler<RemoveConversationRequest, RemoveConversationResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveConversationHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveConversationResponse> Handle(RemoveConversationRequest request, CancellationToken cancellationToken)
    {
        var conversation = await _context.Conversations.SingleAsync(x => x.ConversationId == request.ConversationId);
        _context.Conversations.Remove(conversation);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveConversationResponse()
        {
            Conversation = conversation.ToDto()
        };
    }
}

