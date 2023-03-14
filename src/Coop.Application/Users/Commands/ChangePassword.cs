// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class ChangePasswordValidator : AbstractValidator<ChangePasswordRequest>
{
    public ChangePasswordValidator()
    {
        RuleFor(x => x.OldPassword).NotEmpty();
        RuleFor(x => x.NewPassword)
            .NotEmpty()
            .Must(x => x.Length >= 6);
        RuleFor(x => x.ConfirmationPassword)
            .NotEmpty()
            .Equal(x => x.NewPassword);
    }
}
public class ChangePasswordRequest : IRequest<ChangePasswordResponse>
{
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
    public string ConfirmationPassword { get; set; }
}
public class ChangePasswordResponse
{
}
public class ChangePasswordHandler : IRequestHandler<ChangePasswordRequest, ChangePasswordResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public ChangePasswordHandler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }
    public async Task<ChangePasswordResponse> Handle(ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        if (!_httpContextAccessor.HttpContext.User.Identity.IsAuthenticated)
        {
            return new();
        }
        var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);
        return new()
        {
        };
    }
}

