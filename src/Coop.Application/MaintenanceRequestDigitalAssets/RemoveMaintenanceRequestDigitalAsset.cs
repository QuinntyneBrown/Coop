// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class RemoveMaintenanceRequestDigitalAssetRequest : IRequest<RemoveMaintenanceRequestDigitalAssetResponse>
{
    public Guid MaintenanceRequestDigitalAssetId { get; set; }
}
public class RemoveMaintenanceRequestDigitalAssetResponse : ResponseBase
{
    public MaintenanceRequestDigitalAssetDto MaintenanceRequestDigitalAsset { get; set; }
}
public class RemoveMaintenanceRequestDigitalAssetHandler : IRequestHandler<RemoveMaintenanceRequestDigitalAssetRequest, RemoveMaintenanceRequestDigitalAssetResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveMaintenanceRequestDigitalAssetHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveMaintenanceRequestDigitalAssetResponse> Handle(RemoveMaintenanceRequestDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        var maintenanceRequestDigitalAsset = await _context.MaintenanceRequestDigitalAssets.SingleAsync(x => x.MaintenanceRequestDigitalAssetId == request.MaintenanceRequestDigitalAssetId);
        _context.MaintenanceRequestDigitalAssets.Remove(maintenanceRequestDigitalAsset);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveMaintenanceRequestDigitalAssetResponse()
        {
            MaintenanceRequestDigitalAsset = maintenanceRequestDigitalAsset.ToDto()
        };
    }
}

