using MediatR;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequest;

public class UpdateMaintenanceRequestRequest : IRequest<UpdateMaintenanceRequestResponse>
{
    public Guid MaintenanceRequestId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? UnitNumber { get; set; }
}
