using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestWorkDetails;

[OfficeOnly]
public class UpdateMaintenanceRequestWorkDetailsRequest : IRequest<UpdateMaintenanceRequestWorkDetailsResponse>
{
    public Guid MaintenanceRequestId { get; set; }
    public string WorkDetails { get; set; } = string.Empty;
}
