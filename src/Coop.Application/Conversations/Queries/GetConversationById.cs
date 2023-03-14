// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetConversationByIdRequest : IRequest<GetConversationByIdResponse>
{
    public Guid ConversationId { get; set; }
}
public class GetConversationByIdResponse : ResponseBase
{
    public ConversationDto Conversation { get; set; }
}
public class GetConversationByIdHandler : IRequestHandler<GetConversationByIdRequest, GetConversationByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetConversationByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetConversationByIdResponse> Handle(GetConversationByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Conversation = (await _context.Conversations.SingleOrDefaultAsync(x => x.ConversationId == request.ConversationId)).ToDto()
        };
    }
}

