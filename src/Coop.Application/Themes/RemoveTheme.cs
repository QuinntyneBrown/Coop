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

public class RemoveThemeRequest : IRequest<RemoveThemeResponse>
{
    public Guid ThemeId { get; set; }
}
public class RemoveThemeResponse : ResponseBase
{
    public ThemeDto Theme { get; set; }
}
public class RemoveThemeHandler : IRequestHandler<RemoveThemeRequest, RemoveThemeResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveThemeHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveThemeResponse> Handle(RemoveThemeRequest request, CancellationToken cancellationToken)
    {
        var theme = await _context.Themes.SingleAsync(x => x.ThemeId == request.ThemeId);
        _context.Themes.Remove(theme);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveThemeResponse()
        {
            Theme = theme.ToDto()
        };
    }
}

