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

public class GetNoticesPageRequest : IRequest<GetNoticesPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetNoticesPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<NoticeDto> Entities { get; set; }
}
public class GetNoticesPageHandler : IRequestHandler<GetNoticesPageRequest, GetNoticesPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetNoticesPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetNoticesPageResponse> Handle(GetNoticesPageRequest request, CancellationToken cancellationToken)
    {
        var query = from notice in _context.Notices
                    select notice;
        var length = await _context.Notices.CountAsync();
        var notices = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = notices
        };
    }
}

