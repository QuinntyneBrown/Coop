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

public class GetRolesRequest : IRequest<GetRolesResponse> { }
public class GetRolesResponse : ResponseBase
{
    public List<RoleDto> Roles { get; set; }
}
public class GetRolesHandler : IRequestHandler<GetRolesRequest, GetRolesResponse>
{
    private readonly ICoopDbContext _context;
    public GetRolesHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetRolesResponse> Handle(GetRolesRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Roles = await _context.Roles
            .Include(x => x.Privileges)
            .Select(x => x.ToDto()).ToListAsync()
        };
    }
}

