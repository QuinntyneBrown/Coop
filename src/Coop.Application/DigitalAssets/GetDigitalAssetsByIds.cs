// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class GetDigitalAssetsByIdsRequest : IRequest<GetDigitalAssetsByIdsResponse>
{
    public System.Guid[] DigitalAssetIds { get; set; }
}
public class GetDigitalAssetsByIdsResponse
{
    public List<DigitalAssetDto> DigitalAssets { get; set; }
}
public class GetDigitalAssetsByIdsHandler : IRequestHandler<GetDigitalAssetsByIdsRequest, GetDigitalAssetsByIdsResponse>
{
    public ICoopDbContext _context { get; set; }
    public GetDigitalAssetsByIdsHandler(ICoopDbContext context) => _context = context;
    public async Task<GetDigitalAssetsByIdsResponse> Handle(GetDigitalAssetsByIdsRequest request, CancellationToken cancellationToken)
        => new GetDigitalAssetsByIdsResponse()
        {
            DigitalAssets = await _context.DigitalAssets
            .Where(x => request.DigitalAssetIds.Contains(x.DigitalAssetId))
            .Select(x => x.ToDto())
            .ToListAsync()
        };
}

