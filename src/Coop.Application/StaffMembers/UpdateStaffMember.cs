// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class UpdateStaffMemberValidator : AbstractValidator<UpdateStaffMemberRequest>
{
    public UpdateStaffMemberValidator()
    {
        RuleFor(request => request.StaffMember).NotNull();
        RuleFor(request => request.StaffMember).SetValidator(new StaffMemberValidator());
    }
}
public class UpdateStaffMemberRequest : IRequest<UpdateStaffMemberResponse>
{
    public StaffMemberDto StaffMember { get; set; }
}
public class UpdateStaffMemberResponse : ResponseBase
{
    public StaffMemberDto StaffMember { get; set; }
}
public class UpdateStaffMemberHandler : IRequestHandler<UpdateStaffMemberRequest, UpdateStaffMemberResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateStaffMemberHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateStaffMemberResponse> Handle(UpdateStaffMemberRequest request, CancellationToken cancellationToken)
    {
        var staffMember = await _context.StaffMembers.SingleAsync(x => x.StaffMemberId == request.StaffMember.StaffMemberId);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateStaffMemberResponse()
        {
            StaffMember = staffMember.ToDto()
        };
    }
}

