// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Application.Common.Extensions;
using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class GetConversationsPageRequest : IRequest<GetConversationsPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetConversationsPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<ConversationDto> Entities { get; set; }
}
public class GetConversationsPageHandler : IRequestHandler<GetConversationsPageRequest, GetConversationsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetConversationsPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetConversationsPageResponse> Handle(GetConversationsPageRequest request, CancellationToken cancellationToken)
    {
        var query = from conversation in _context.Conversations
                    select conversation;
        var length = await _context.Conversations.CountAsync();
        var conversations = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = conversations
        };
    }
}

