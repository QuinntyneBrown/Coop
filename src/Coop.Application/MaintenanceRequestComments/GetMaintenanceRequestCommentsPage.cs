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

public class GetMaintenanceRequestCommentsPageRequest : IRequest<GetMaintenanceRequestCommentsPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetMaintenanceRequestCommentsPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<MaintenanceRequestCommentDto> Entities { get; set; }
}
public class GetMaintenanceRequestCommentsPageHandler : IRequestHandler<GetMaintenanceRequestCommentsPageRequest, GetMaintenanceRequestCommentsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetMaintenanceRequestCommentsPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetMaintenanceRequestCommentsPageResponse> Handle(GetMaintenanceRequestCommentsPageRequest request, CancellationToken cancellationToken)
    {
        var query = from maintenanceRequestComment in _context.MaintenanceRequestComments
                    select maintenanceRequestComment;
        var length = await _context.MaintenanceRequestComments.CountAsync();
        var maintenanceRequestComments = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = maintenanceRequestComments
        };
    }
}

