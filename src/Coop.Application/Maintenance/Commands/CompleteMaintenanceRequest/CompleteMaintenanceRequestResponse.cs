using Coop.Application.Maintenance.Dtos;

namespace Coop.Application.Maintenance.Commands.CompleteMaintenanceRequest;

public class CompleteMaintenanceRequestResponse
{
    public MaintenanceRequestDto MaintenanceRequest { get; set; } = default!;
}
