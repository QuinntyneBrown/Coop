using MediatR;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestDescription;

public class UpdateMaintenanceRequestDescriptionRequest : IRequest<UpdateMaintenanceRequestDescriptionResponse>
{
    public Guid MaintenanceRequestId { get; set; }
    public string Description { get; set; } = string.Empty;
}
