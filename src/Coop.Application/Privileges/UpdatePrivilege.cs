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

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.Privilege).NotNull();
        RuleFor(request => request.Privilege).SetValidator(new PrivilegeValidator());
    }
}
public class UpdatePrivilegeRequest : IRequest<UpdatePrivilegeResponse>
{
    public PrivilegeDto Privilege { get; set; }
}
public class UpdatePrivilegeResponse : ResponseBase
{
    public PrivilegeDto Privilege { get; set; }
}
public class UpdatePrivilegeHandler : IRequestHandler<UpdatePrivilegeRequest, UpdatePrivilegeResponse>
{
    private readonly ICoopDbContext _context;
    public UpdatePrivilegeHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdatePrivilegeResponse> Handle(UpdatePrivilegeRequest request, CancellationToken cancellationToken)
    {
        var privilege = await _context.Privileges.SingleAsync(x => x.PrivilegeId == request.Privilege.PrivilegeId);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            Privilege = privilege.ToDto()
        };
    }
}

