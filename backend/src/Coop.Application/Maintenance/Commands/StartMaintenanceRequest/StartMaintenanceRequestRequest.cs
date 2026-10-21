using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Maintenance.Commands.StartMaintenanceRequest;

[OfficeOnly]
public class StartMaintenanceRequestRequest : IRequest<StartMaintenanceRequestResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
