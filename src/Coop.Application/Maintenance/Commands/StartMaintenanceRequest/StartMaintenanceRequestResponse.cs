using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Commands.StartMaintenanceRequest;

public class StartMaintenanceRequestResponse
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; } = default!;
}
