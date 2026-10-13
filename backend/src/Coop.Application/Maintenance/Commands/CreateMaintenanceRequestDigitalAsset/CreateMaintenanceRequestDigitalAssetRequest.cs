using MediatR;

namespace Coop.Application.Maintenance.Commands.CreateMaintenanceRequestDigitalAsset;

public class CreateMaintenanceRequestDigitalAssetRequest : IRequest<CreateMaintenanceRequestDigitalAssetResponse>
{
    public Guid MaintenanceRequestId { get; set; }
    public Guid DigitalAssetId { get; set; }
}
