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

public class GetStoredEventsRequest : IRequest<GetStoredEventsResponse> { }
public class GetStoredEventsResponse : ResponseBase
{
    public List<StoredEventDto> StoredEvents { get; set; }
}
public class GetStoredEventsHandler : IRequestHandler<GetStoredEventsRequest, GetStoredEventsResponse>
{
    private readonly ICoopDbContext _context;
    public GetStoredEventsHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetStoredEventsResponse> Handle(GetStoredEventsRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            StoredEvents = await _context.StoredEvents.Select(x => x.ToDto()).ToListAsync()
        };
    }
}

