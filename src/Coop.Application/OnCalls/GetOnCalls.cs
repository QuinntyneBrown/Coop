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

public class GetOnCallsRequest : IRequest<GetOnCallsResponse> { }
public class GetOnCallsResponse : ResponseBase
{
    public List<OnCallDto> OnCalls { get; set; }
}
public class GetOnCallsHandler : IRequestHandler<GetOnCallsRequest, GetOnCallsResponse>
{
    private readonly ICoopDbContext _context;
    public GetOnCallsHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetOnCallsResponse> Handle(GetOnCallsRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            OnCalls = await _context.OnCalls.Select(x => x.ToDto()).ToListAsync()
        };
    }
}

