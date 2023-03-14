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

public class GetMaintenanceRequestDigitalAssetByIdRequest : IRequest<GetMaintenanceRequestDigitalAssetByIdResponse>
{
    public Guid MaintenanceRequestDigitalAssetId { get; set; }
}
public class GetMaintenanceRequestDigitalAssetByIdResponse : ResponseBase
{
    public MaintenanceRequestDigitalAssetDto MaintenanceRequestDigitalAsset { get; set; }
}
public class GetMaintenanceRequestDigitalAssetByIdHandler : IRequestHandler<GetMaintenanceRequestDigitalAssetByIdRequest, GetMaintenanceRequestDigitalAssetByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetMaintenanceRequestDigitalAssetByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetMaintenanceRequestDigitalAssetByIdResponse> Handle(GetMaintenanceRequestDigitalAssetByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            MaintenanceRequestDigitalAsset = (await _context.MaintenanceRequestDigitalAssets.SingleOrDefaultAsync(x => x.MaintenanceRequestDigitalAssetId == request.MaintenanceRequestDigitalAssetId)).ToDto()
        };
    }
}

