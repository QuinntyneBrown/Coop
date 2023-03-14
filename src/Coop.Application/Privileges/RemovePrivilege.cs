// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class RemovePrivilegeRequest : IRequest<RemovePrivilegeResponse>
{
    public Guid PrivilegeId { get; set; }
}
public class RemovePrivilegeResponse : ResponseBase
{
    public PrivilegeDto Privilege { get; set; }
}
public class RemovePrivilegeHandler : IRequestHandler<RemovePrivilegeRequest, RemovePrivilegeResponse>
{
    private readonly ICoopDbContext _context;
    public RemovePrivilegeHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemovePrivilegeResponse> Handle(RemovePrivilegeRequest request, CancellationToken cancellationToken)
    {
        var privilege = await _context.Privileges.SingleAsync(x => x.PrivilegeId == request.PrivilegeId);
        _context.Privileges.Remove(privilege);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemovePrivilegeResponse()
        {
            Privilege = privilege.ToDto()
        };
    }
}

