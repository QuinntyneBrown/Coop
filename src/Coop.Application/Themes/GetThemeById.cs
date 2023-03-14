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

public class GetThemeByIdRequest : IRequest<GetThemeByIdResponse>
{
    public Guid ThemeId { get; set; }
}
public class GetThemeByIdResponse : ResponseBase
{
    public ThemeDto Theme { get; set; }
}
public class GetThemeByIdHandler : IRequestHandler<GetThemeByIdRequest, GetThemeByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetThemeByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetThemeByIdResponse> Handle(GetThemeByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Theme = (await _context.Themes.SingleOrDefaultAsync(x => x.ThemeId == request.ThemeId)).ToDto()
        };
    }
}

