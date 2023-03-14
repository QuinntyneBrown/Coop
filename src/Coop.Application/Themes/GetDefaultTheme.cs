// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class GetDefaultThemeRequest : IRequest<GetDefaultThemeResponse>
{
}
public class GetDefaultThemeResponse : ResponseBase
{
    public ThemeDto Theme { get; set; }
}
public class GetDefaultThemeHandler : IRequestHandler<GetDefaultThemeRequest, GetDefaultThemeResponse>
{
    private readonly ICoopDbContext _context;
    public GetDefaultThemeHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetDefaultThemeResponse> Handle(GetDefaultThemeRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Theme = (await _context.Themes.SingleOrDefaultAsync(x => x.ProfileId == null)).ToDto()
        };
    }
}

