// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Coop.Domain.Entities;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.Theme).NotNull();
        RuleFor(request => request.Theme).SetValidator(new ThemeValidator());
    }
}
public class UpdateThemeRequest : IRequest<UpdateThemeResponse>
{
    public ThemeDto Theme { get; set; }
}
public class UpdateThemeResponse : ResponseBase
{
    public ThemeDto Theme { get; set; }
}
public class UpdateThemeHandler : IRequestHandler<UpdateThemeRequest, UpdateThemeResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateThemeHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateThemeResponse> Handle(UpdateThemeRequest request, CancellationToken cancellationToken)
    {
        var theme = await _context.Themes.SingleAsync(x => x.ThemeId == request.Theme.ThemeId);
        theme.SetCssCustomProperties(request.Theme.CssCustomProperties);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            Theme = theme.ToDto()
        };
    }
}

