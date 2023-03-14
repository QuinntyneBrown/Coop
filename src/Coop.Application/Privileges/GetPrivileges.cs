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

public class GetPrivilegesRequest : IRequest<GetPrivilegesResponse> { }
public class GetPrivilegesResponse : ResponseBase
{
    public List<PrivilegeDto> Privileges { get; set; }
}
public class GetPrivilegesHandler : IRequestHandler<GetPrivilegesRequest, GetPrivilegesResponse>
{
    private readonly ICoopDbContext _context;
    public GetPrivilegesHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetPrivilegesResponse> Handle(GetPrivilegesRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Privileges = await _context.Privileges.Select(x => x.ToDto()).ToListAsync()
        };
    }
}

