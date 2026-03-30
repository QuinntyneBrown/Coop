using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequest;

public class UpdateMaintenanceRequestResponse
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; } = default!;
}
