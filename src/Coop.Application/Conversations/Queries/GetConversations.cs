// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetConversationsRequest : IRequest<GetConversationsResponse> { }
public class GetConversationsResponse : ResponseBase
{
    public List<ConversationDto> Conversations { get; set; }
}
public class GetConversationsHandler : IRequestHandler<GetConversationsRequest, GetConversationsResponse>
{
    private readonly ICoopDbContext _context;
    public GetConversationsHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetConversationsResponse> Handle(GetConversationsRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Conversations = await _context.Conversations.Select(x => x.ToDto()).ToListAsync()
        };
    }
}

