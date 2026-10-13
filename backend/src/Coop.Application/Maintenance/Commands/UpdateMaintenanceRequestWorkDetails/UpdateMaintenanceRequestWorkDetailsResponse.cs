using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Commands.UpdateMaintenanceRequestWorkDetails;

public class UpdateMaintenanceRequestWorkDetailsResponse
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; } = default!;
}
