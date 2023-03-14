// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.MaintenanceRequestDigitalAsset).NotNull();
        RuleFor(request => request.MaintenanceRequestDigitalAsset).SetValidator(new MaintenanceRequestDigitalAssetValidator());
    }
}
public class CreateMaintenanceRequestDigitalAssetRequest : IRequest<CreateMaintenanceRequestDigitalAssetResponse>
{
    public MaintenanceRequestDigitalAssetDto MaintenanceRequestDigitalAsset { get; set; }
}
public class CreateMaintenanceRequestDigitalAssetResponse : ResponseBase
{
    public MaintenanceRequestDigitalAssetDto MaintenanceRequestDigitalAsset { get; set; }
}
public class CreateMaintenanceRequestDigitalAssetHandler : IRequestHandler<CreateMaintenanceRequestDigitalAssetRequest, CreateMaintenanceRequestDigitalAssetResponse>
{
    private readonly ICoopDbContext _context;
    public CreateMaintenanceRequestDigitalAssetHandler(ICoopDbContext context)
        => _context = context;
    public async Task<CreateMaintenanceRequestDigitalAssetResponse> Handle(CreateMaintenanceRequestDigitalAssetRequest request, CancellationToken cancellationToken)
    {
        var maintenanceRequestDigitalAsset = new MaintenanceRequestDigitalAsset(
            request.MaintenanceRequestDigitalAsset.MaintenanceRequestId,
            request.MaintenanceRequestDigitalAsset.DigitalAssetId
            );
        _context.MaintenanceRequestDigitalAssets.Add(maintenanceRequestDigitalAsset);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            MaintenanceRequestDigitalAsset = maintenanceRequestDigitalAsset.ToDto()
        };
    }
}

