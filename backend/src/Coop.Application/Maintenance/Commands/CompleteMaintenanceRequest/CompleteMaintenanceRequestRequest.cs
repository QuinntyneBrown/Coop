using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Maintenance.Commands.CompleteMaintenanceRequest;

[OfficeOnly]
public class CompleteMaintenanceRequestRequest : IRequest<CompleteMaintenanceRequestResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
