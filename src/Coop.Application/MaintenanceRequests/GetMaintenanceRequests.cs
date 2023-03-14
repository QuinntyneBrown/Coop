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

public class GetMaintenanceRequestsRequest : IRequest<GetMaintenanceRequestsResponse> { }
public class GetMaintenanceRequestsResponse : ResponseBase
{
    public List<MaintenanceRequestDto> MaintenanceRequests { get; set; }
}
public class GetMaintenanceRequestsHandler : IRequestHandler<GetMaintenanceRequestsRequest, GetMaintenanceRequestsResponse>
{
    private readonly ICoopDbContext _context;
    public GetMaintenanceRequestsHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetMaintenanceRequestsResponse> Handle(GetMaintenanceRequestsRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            MaintenanceRequests = await _context.MaintenanceRequests
            .Include(x => x.DigitalAssets)
            .Select(x => x.ToDto()).ToListAsync()
        };
    }
}
