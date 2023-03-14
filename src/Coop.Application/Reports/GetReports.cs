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

public class GetReportsRequest : IRequest<GetReportsResponse> { }
public class GetReportsResponse : ResponseBase
{
    public List<ReportDto> Reports { get; set; }
}
public class GetReportsHandler : IRequestHandler<GetReportsRequest, GetReportsResponse>
{
    private readonly ICoopDbContext _context;
    public GetReportsHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetReportsResponse> Handle(GetReportsRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Reports = await _context.Reports.Select(x => x.ToDto()).ToListAsync()
        };
    }
}

