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

public class GetDigitalAssetsRequest : IRequest<GetDigitalAssetsResponse> { }
public class GetDigitalAssetsResponse : ResponseBase
{
    public List<DigitalAssetDto> DigitalAssets { get; set; }
}
public class GetDigitalAssetsHandler : IRequestHandler<GetDigitalAssetsRequest, GetDigitalAssetsResponse>
{
    private readonly ICoopDbContext _context;
    public GetDigitalAssetsHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetDigitalAssetsResponse> Handle(GetDigitalAssetsRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            DigitalAssets = await _context.DigitalAssets.Select(x => x.ToDto()).ToListAsync()
        };
    }
}

