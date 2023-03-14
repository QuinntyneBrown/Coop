// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class ReceiveMaintenanceRequestRequest : Coop.Domain.DomainEvents.ReceiveMaintenanceRequest, IRequest<ReceiveMaintenanceRequestResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
public class ReceiveMaintenanceRequestResponse
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; }
}
public class ReceiveMaintenanceRequestHandler : IRequestHandler<ReceiveMaintenanceRequestRequest, ReceiveMaintenanceRequestResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public ReceiveMaintenanceRequestHandler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }
    public async Task<ReceiveMaintenanceRequestResponse> Handle(ReceiveMaintenanceRequestRequest request, CancellationToken cancellationToken)
    {
        var maintenanceRequest = await _context.MaintenanceRequests.SingleAsync(x => x.MaintenanceRequestId == request.MaintenanceRequestId);
        var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);
        var user = await _context.Users.FindAsync(userId);
        request.ReceivedByProfileId = user.CurrentProfileId;
        maintenanceRequest.Apply(request);
        await _context.SaveChangesAsync(default);
        return new()
        {
            MaintenanceRequest = maintenanceRequest.ToDto()
        };
    }
}

