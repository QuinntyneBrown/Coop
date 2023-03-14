// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Coop.Application.Common.Extensions;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Application.Common.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetThemesPageRequest : IRequest<GetThemesPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetThemesPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<ThemeDto> Entities { get; set; }
}
public class GetThemesPageHandler : IRequestHandler<GetThemesPageRequest, GetThemesPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetThemesPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetThemesPageResponse> Handle(GetThemesPageRequest request, CancellationToken cancellationToken)
    {
        var query = from theme in _context.Themes
                    select theme;
        var length = await _context.Themes.CountAsync();
        var themes = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = themes
        };
    }
}

