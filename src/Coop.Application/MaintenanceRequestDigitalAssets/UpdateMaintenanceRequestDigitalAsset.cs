// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class UpdateMaintenanceRequestDigitalAssetValidator : AbstractValidator<UpdateMaintenanceRequestDigitalAssetRequest>
{
    public UpdateMaintenanceRequestDigitalAssetValidator()
    {
        RuleFor(request => request.MaintenanceRequestDigitalAsset).NotNull();
        RuleFor(request => request.MaintenanceRequestDigitalAsset).SetValidator(new MaintenanceRequestDigitalAssetValidator());
    }
}
public class UpdateMaintenanceRequestDigitalAssetRequest : IRequest<UpdateMaintenanceRequestDigitalAssetResponse>
{
    public MaintenanceRequestDigitalAssetDto MaintenanceRequestDigitalAsset { get; set; }
}
public class UpdateMaintenanceRequestDigitalAssetResponse : ResponseBase
{
    public MaintenanceRequestDigitalAssetDto MaintenanceRequestDigitalAsset { get; set; }
}
public class UpdateMaintenanceRequestDigitalAssetHandler : IRequestHandler<UpdateMaintenanceRequestDigitalAssetRequest, UpdateMaintenanceRequestDigitalAssetResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateMaintenanceRequestDigitalAssetHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateMaintenanceRequestDigitalAssetResponse> Handle(UpdateMaintenanceRequestDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        var maintenanceRequestDigitalAsset = await _context.MaintenanceRequestDigitalAssets.SingleAsync(x => x.MaintenanceRequestDigitalAssetId == request.MaintenanceRequestDigitalAsset.MaintenanceRequestDigitalAssetId);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateMaintenanceRequestDigitalAssetResponse()
        {
            MaintenanceRequestDigitalAsset = maintenanceRequestDigitalAsset.ToDto()
        };
    }
}

