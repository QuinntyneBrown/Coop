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

public class GetStaffMemberByIdRequest : IRequest<GetStaffMemberByIdResponse>
{
    public Guid StaffMemberId { get; set; }
}
public class GetStaffMemberByIdResponse : ResponseBase
{
    public StaffMemberDto StaffMember { get; set; }
}
public class GetStaffMemberByIdHandler : IRequestHandler<GetStaffMemberByIdRequest, GetStaffMemberByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetStaffMemberByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetStaffMemberByIdResponse> Handle(GetStaffMemberByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            StaffMember = (await _context.StaffMembers.SingleOrDefaultAsync(x => x.StaffMemberId == request.StaffMemberId)).ToDto()
        };
    }
}

