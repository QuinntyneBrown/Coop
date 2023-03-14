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

public class GetOnCallsPageRequest : IRequest<GetOnCallsPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetOnCallsPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<OnCallDto> Entities { get; set; }
}
public class GetOnCallsPageHandler : IRequestHandler<GetOnCallsPageRequest, GetOnCallsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetOnCallsPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetOnCallsPageResponse> Handle(GetOnCallsPageRequest request, CancellationToken cancellationToken)
    {
        var query = from onCall in _context.OnCalls
                    select onCall;
        var length = await _context.OnCalls.CountAsync();
        var onCalls = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = onCalls
        };
    }
}

