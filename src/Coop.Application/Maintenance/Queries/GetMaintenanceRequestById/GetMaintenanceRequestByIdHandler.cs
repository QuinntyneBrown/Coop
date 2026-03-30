using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using Coop.SharedKernel;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestById;

public class GetMaintenanceRequestByIdHandler : IRequestHandler<GetMaintenanceRequestByIdRequest, GetMaintenanceRequestByIdResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetMaintenanceRequestByIdHandler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor = null!)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<GetMaintenanceRequestByIdResponse> Handle(GetMaintenanceRequestByIdRequest request, CancellationToken cancellationToken)
    {
        var mr = await _context.MaintenanceRequests.Include(m => m.Comments).Include(m => m.DigitalAssets)
            .SingleAsync(m => m.MaintenanceRequestId == request.MaintenanceRequestId, cancellationToken);
        return new GetMaintenanceRequestByIdResponse { MaintenanceRequest = MaintenanceRequestDto.FromMaintenanceRequest(mr) };
    }
}
