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

public class GetProfilesPageRequest : IRequest<GetProfilesPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetProfilesPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<ProfileDto> Entities { get; set; }
}
public class GetProfilesPageHandler : IRequestHandler<GetProfilesPageRequest, GetProfilesPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetProfilesPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetProfilesPageResponse> Handle(GetProfilesPageRequest request, CancellationToken cancellationToken)
    {
        var query = from profile in _context.Profiles
                    select profile;
        var length = await _context.Profiles.CountAsync();
        var profiles = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = profiles
        };
    }
}

