// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class CreateThemeValidator : AbstractValidator<CreateThemeRequest>
{
    public CreateThemeValidator()
    {
        RuleFor(request => request.Theme).NotNull();
        RuleFor(request => request.Theme).SetValidator(new ThemeValidator());
    }
}
public class CreateThemeRequest : IRequest<CreateThemeResponse>
{
    public ThemeDto Theme { get; set; }
}
public class CreateThemeResponse : ResponseBase
{
    public ThemeDto Theme { get; set; }
}
public class CreateThemeHandler : IRequestHandler<CreateThemeRequest, CreateThemeResponse>
{
    private readonly ICoopDbContext _context;
    public CreateThemeHandler(ICoopDbContext context)
        => _context = context;
    public async Task<CreateThemeResponse> Handle(CreateThemeRequest request, CancellationToken cancellationToken)
    {
        var theme = new Theme(request.Theme.ProfileId, request.Theme.CssCustomProperties);
        _context.Themes.Add(theme);
        await _context.SaveChangesAsync(cancellationToken);
        return new CreateThemeResponse()
        {
            Theme = theme.ToDto()
        };
    }
}

