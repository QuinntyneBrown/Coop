using MediatR;

namespace Coop.Application.Maintenance.Commands.StartMaintenanceRequest;

public class StartMaintenanceRequestRequest : IRequest<StartMaintenanceRequestResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
