using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetMaintenanceRequestByIdRequest : IRequest<GetMaintenanceRequestByIdResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
public class GetMaintenanceRequestByIdResponse : ResponseBase
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; }
}
public class GetMaintenanceRequestByIdHandler : IRequestHandler<GetMaintenanceRequestByIdRequest, GetMaintenanceRequestByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetMaintenanceRequestByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetMaintenanceRequestByIdResponse> Handle(GetMaintenanceRequestByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            MaintenanceRequest = (await _context.MaintenanceRequests
            .Include(x => x.DigitalAssets)
            .SingleOrDefaultAsync(x => x.MaintenanceRequestId == request.MaintenanceRequestId)).ToDto()
        };
    }
}
