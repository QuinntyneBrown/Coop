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

public class GetMaintenanceRequestDigitalAssetsRequest : IRequest<GetMaintenanceRequestDigitalAssetsResponse> { }
public class GetMaintenanceRequestDigitalAssetsResponse : ResponseBase
{
    public List<MaintenanceRequestDigitalAssetDto> MaintenanceRequestDigitalAssets { get; set; }
}
public class GetMaintenanceRequestDigitalAssetsHandler : IRequestHandler<GetMaintenanceRequestDigitalAssetsRequest, GetMaintenanceRequestDigitalAssetsResponse>
{
    private readonly ICoopDbContext _context;
    public GetMaintenanceRequestDigitalAssetsHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetMaintenanceRequestDigitalAssetsResponse> Handle(GetMaintenanceRequestDigitalAssetsRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            MaintenanceRequestDigitalAssets = await _context.MaintenanceRequestDigitalAssets.Select(x => x.ToDto()).ToListAsync()
        };
    }
}

