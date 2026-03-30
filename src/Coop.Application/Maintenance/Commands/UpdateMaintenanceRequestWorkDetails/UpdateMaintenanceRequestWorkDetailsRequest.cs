using MediatR;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestWorkDetails;

public class UpdateMaintenanceRequestWorkDetailsRequest : IRequest<UpdateMaintenanceRequestWorkDetailsResponse>
{
    public Guid MaintenanceRequestId { get; set; }
    public string WorkDetails { get; set; } = string.Empty;
}
