using MediatR;

namespace Coop.Application.Maintenance.Commands.CreateMaintenanceRequest;

public class CreateMaintenanceRequestRequest : IRequest<CreateMaintenanceRequestResponse>
{
    public Guid RequestedByProfileId { get; set; }
    public string RequestedByName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? UnitNumber { get; set; }
}
