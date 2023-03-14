using Coop.Domain;
using Coop.Application.Common.Extensions;
using Coop.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features;

public class GetMaintenanceRequestsPageRequest : IRequest<GetMaintenanceRequestsPageResponse>
{
    public int PageSize { get; set; }
    public int Index { get; set; }
}
public class GetMaintenanceRequestsPageResponse : ResponseBase
{
    public int Length { get; set; }
    public List<MaintenanceRequestDto> Entities { get; set; }
}
public class GetMaintenanceRequestsPageHandler : IRequestHandler<GetMaintenanceRequestsPageRequest, GetMaintenanceRequestsPageResponse>
{
    private readonly ICoopDbContext _context;
    public GetMaintenanceRequestsPageHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetMaintenanceRequestsPageResponse> Handle(GetMaintenanceRequestsPageRequest request, CancellationToken cancellationToken)
    {
        var query = from maintenanceRequest in _context.MaintenanceRequests
                    select maintenanceRequest;
        var length = await _context.MaintenanceRequests.CountAsync();
        var maintenanceRequests = await query.Page(request.Index, request.PageSize)
            .Include(x => x.DigitalAssets)
            .Select(x => x.ToDto()).ToListAsync();
        return new()
        {
            Length = length,
            Entities = maintenanceRequests
        };
    }
}
