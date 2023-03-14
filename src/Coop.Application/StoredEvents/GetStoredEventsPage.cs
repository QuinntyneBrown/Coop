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

public class GetStoredEventsPageRequest : IRequest<GetStoredEventsPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetStoredEventsPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<StoredEventDto> Entities { get; set; }
}
public class GetStoredEventsPageHandler : IRequestHandler<GetStoredEventsPageRequest, GetStoredEventsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetStoredEventsPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetStoredEventsPageResponse> Handle(GetStoredEventsPageRequest request, CancellationToken cancellationToken)
    {
        var query = from storedEvent in _context.StoredEvents
                    select storedEvent;
        var length = await _context.StoredEvents.CountAsync();
        var storedEvents = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = storedEvents
        };
    }
}

