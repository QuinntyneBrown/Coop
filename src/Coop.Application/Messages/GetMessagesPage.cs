// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Coop.Application.Common.Extensions;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Application.Common.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetMessagesPageRequest : IRequest<GetMessagesPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetMessagesPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<MessageDto> Entities { get; set; }
}
public class GetMessagesPageHandler : IRequestHandler<GetMessagesPageRequest, GetMessagesPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetMessagesPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetMessagesPageResponse> Handle(GetMessagesPageRequest request, CancellationToken cancellationToken)
    {
        var query = from message in _context.Messages
                    select message;
        var length = await _context.Messages.CountAsync();
        var messages = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = messages
        };
    }
}

