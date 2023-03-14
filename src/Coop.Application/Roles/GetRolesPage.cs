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

public class GetRolesPageRequest : IRequest<GetRolesPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetRolesPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<RoleDto> Entities { get; set; }
}
public class GetRolesPageHandler : IRequestHandler<GetRolesPageRequest, GetRolesPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetRolesPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetRolesPageResponse> Handle(GetRolesPageRequest request, CancellationToken cancellationToken)
    {
        var query = from role in _context.Roles
                    select role;
        var length = await _context.Roles.CountAsync();
        var roles = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = roles
        };
    }
}

