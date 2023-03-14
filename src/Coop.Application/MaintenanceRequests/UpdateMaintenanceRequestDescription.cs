// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class UpdateMaintenanceRequestDescriptionRequest : Coop.Domain.DomainEvents.UpdateMaintenanceRequestDescription, IRequest<UpdateMaintenanceRequestDescriptionResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
public class UpdateMaintenanceRequestDescriptionResponse
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; }
}
public class UpdateMaintenanceRequestDescriptionHandler : IRequestHandler<UpdateMaintenanceRequestDescriptionRequest, UpdateMaintenanceRequestDescriptionResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateMaintenanceRequestDescriptionHandler(ICoopDbContext context)
    {
        _context = context;
    }
    public async Task<UpdateMaintenanceRequestDescriptionResponse> Handle(UpdateMaintenanceRequestDescriptionRequest request, CancellationToken cancellationToken)
    {
        var maintenanceRequest = await _context.MaintenanceRequests
            .SingleAsync(x => x.MaintenanceRequestId == request.MaintenanceRequestId);
        maintenanceRequest.Apply(request);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateMaintenanceRequestDescriptionResponse()
        {
            MaintenanceRequest = maintenanceRequest.ToDto()
        };
    }
}

