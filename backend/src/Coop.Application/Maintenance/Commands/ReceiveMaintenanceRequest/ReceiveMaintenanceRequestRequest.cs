using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Maintenance.Commands.ReceiveMaintenanceRequest;

[OfficeOnly]
public class ReceiveMaintenanceRequestRequest : IRequest<ReceiveMaintenanceRequestResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
