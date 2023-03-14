// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetRoleByIdRequest : IRequest<GetRoleByIdResponse>
{
    public Guid RoleId { get; set; }
}
public class GetRoleByIdResponse : ResponseBase
{
    public RoleDto Role { get; set; }
}
public class GetRoleByIdHandler : IRequestHandler<GetRoleByIdRequest, GetRoleByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetRoleByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetRoleByIdResponse> Handle(GetRoleByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Role = (await _context.Roles
            .Include(x => x.Privileges)
            .SingleOrDefaultAsync(x => x.RoleId == request.RoleId)).ToDto()
        };
    }
}

