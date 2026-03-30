using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestDescription;

public class UpdateMaintenanceRequestDescriptionResponse
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; } = default!;
}
