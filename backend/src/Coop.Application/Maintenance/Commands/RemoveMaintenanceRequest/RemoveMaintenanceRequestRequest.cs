using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Maintenance.Commands.RemoveMaintenanceRequest;

[OfficeOnly]
public class RemoveMaintenanceRequestRequest : IRequest<RemoveMaintenanceRequestResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
