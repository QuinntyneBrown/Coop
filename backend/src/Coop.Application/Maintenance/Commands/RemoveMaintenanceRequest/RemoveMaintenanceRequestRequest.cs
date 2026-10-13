using MediatR;

namespace Coop.Application.Maintenance.Commands.RemoveMaintenanceRequest;

public class RemoveMaintenanceRequestRequest : IRequest<RemoveMaintenanceRequestResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
