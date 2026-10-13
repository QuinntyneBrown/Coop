using MediatR;

namespace Coop.Application.Maintenance.Commands.ReceiveMaintenanceRequest;

public class ReceiveMaintenanceRequestRequest : IRequest<ReceiveMaintenanceRequestResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
