// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class CreatePrivilegeValidator : AbstractValidator<CreatePrivilegeRequest>
{
    public CreatePrivilegeValidator()
    {
        RuleFor(request => request.Privilege).NotNull();
        RuleFor(request => request.Privilege).SetValidator(new PrivilegeValidator());
    }
}
public class CreatePrivilegeRequest : IRequest<CreatePrivilegeResponse>
{
    public PrivilegeDto Privilege { get; set; }
}
public class CreatePrivilegeResponse : ResponseBase
{
    public PrivilegeDto Privilege { get; set; }
}
public class CreatePrivilegeHandler : IRequestHandler<CreatePrivilegeRequest, CreatePrivilegeResponse>
{
    private readonly ICoopDbContext _context;
    public CreatePrivilegeHandler(ICoopDbContext context)
        => _context = context;
    public async Task<CreatePrivilegeResponse> Handle(CreatePrivilegeRequest request, CancellationToken cancellationToken)
    {
        var privilege = new Privilege(
            request.Privilege.RoleId,
            request.Privilege.AccessRight,
            request.Privilege.Aggregate
            );
        _context.Privileges.Add(privilege);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            Privilege = privilege.ToDto()
        };
    }
}

