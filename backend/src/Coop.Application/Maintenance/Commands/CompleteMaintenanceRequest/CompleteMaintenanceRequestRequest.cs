using MediatR;

namespace Coop.Application.Maintenance.Commands.CompleteMaintenanceRequest;

public class CompleteMaintenanceRequestRequest : IRequest<CompleteMaintenanceRequestResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
