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

public class GetMaintenanceRequestDigitalAssetsPageRequest : IRequest<GetMaintenanceRequestDigitalAssetsPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetMaintenanceRequestDigitalAssetsPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<MaintenanceRequestDigitalAssetDto> Entities { get; set; }
}
public class GetMaintenanceRequestDigitalAssetsPageHandler : IRequestHandler<GetMaintenanceRequestDigitalAssetsPageRequest, GetMaintenanceRequestDigitalAssetsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetMaintenanceRequestDigitalAssetsPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetMaintenanceRequestDigitalAssetsPageResponse> Handle(GetMaintenanceRequestDigitalAssetsPageRequest request, CancellationToken cancellationToken)
    {
        var query = from maintenanceRequestDigitalAsset in _context.MaintenanceRequestDigitalAssets
                    select maintenanceRequestDigitalAsset;
        var length = await _context.MaintenanceRequestDigitalAssets.CountAsync();
        var maintenanceRequestDigitalAssets = await query.Page(request.Index, request.PageSize)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = maintenanceRequestDigitalAssets
        };
    }
}

