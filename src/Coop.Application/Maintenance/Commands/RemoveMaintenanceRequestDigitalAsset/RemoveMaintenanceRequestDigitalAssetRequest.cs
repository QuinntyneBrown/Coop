using MediatR;

namespace Coop.Application.Maintenance.Commands.RemoveMaintenanceRequestDigitalAsset;

public class RemoveMaintenanceRequestDigitalAssetRequest : IRequest<RemoveMaintenanceRequestDigitalAssetResponse>
{
    public Guid MaintenanceRequestDigitalAssetId { get; set; }
}
