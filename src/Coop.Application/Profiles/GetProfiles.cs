// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetProfilesRequest : IRequest<GetProfilesResponse> { }
public class GetProfilesResponse : ResponseBase
{
    public List<ProfileDto> Profiles { get; set; }
}
public class GetProfilesHandler : IRequestHandler<GetProfilesRequest, GetProfilesResponse>
{
    private readonly ICoopDbContext _context;
    public GetProfilesHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetProfilesResponse> Handle(GetProfilesRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Profiles = await _context.Profiles.Select(x => x.ToDto()).ToListAsync()
        };
    }
}

