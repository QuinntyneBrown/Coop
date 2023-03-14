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

public class GetReportsPageRequest : IRequest<GetReportsPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetReportsPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<ReportDto> Entities { get; set; }
}
public class GetReportsPageHandler : IRequestHandler<GetReportsPageRequest, GetReportsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetReportsPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetReportsPageResponse> Handle(GetReportsPageRequest request, CancellationToken cancellationToken)
    {
        var query = from report in _context.Reports
                    select report;
        var length = await _context.Reports.CountAsync();
        var reports = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = reports
        };
    }
}

