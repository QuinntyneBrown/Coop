using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using Coop.Domain.Maintenance;
using MediatR;

namespace Coop.Application.Maintenance.Commands.CreateMaintenanceRequest;

public class CreateMaintenanceRequestHandler : IRequestHandler<CreateMaintenanceRequestRequest, CreateMaintenanceRequestResponse>
{
    private readonly ICoopDbContext _context;

    public CreateMaintenanceRequestHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<CreateMaintenanceRequestResponse> Handle(CreateMaintenanceRequestRequest request, CancellationToken cancellationToken)
    {
        var maintenanceRequest = new MaintenanceRequest
        {
            RequestedByProfileId = request.RequestedByProfileId,
            RequestedByName = request.RequestedByName,
            Title = request.Title,
            Description = request.Description,
            Phone = request.Phone,
            UnitNumber = request.UnitNumber
        };

        _context.MaintenanceRequests.Add(maintenanceRequest);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateMaintenanceRequestResponse
        {
            MaintenanceRequest = MaintenanceRequestDto.FromMaintenanceRequest(maintenanceRequest)
        };
    }
}
