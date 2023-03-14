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

public class RemoveStaffMemberRequest : IRequest<RemoveStaffMemberResponse>
{
    public Guid StaffMemberId { get; set; }
}
public class RemoveStaffMemberResponse : ResponseBase
{
    public StaffMemberDto StaffMember { get; set; }
}
public class RemoveStaffMemberHandler : IRequestHandler<RemoveStaffMemberRequest, RemoveStaffMemberResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveStaffMemberHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveStaffMemberResponse> Handle(RemoveStaffMemberRequest request, CancellationToken cancellationToken)
    {
        var staffMember = await _context.StaffMembers.SingleAsync(x => x.StaffMemberId == request.StaffMemberId);
        _context.StaffMembers.Remove(staffMember);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveStaffMemberResponse()
        {
            StaffMember = staffMember.ToDto()
        };
    }
}

