using Coop.Application.Behaviors;
using MediatR;

namespace Coop.Application.Maintenance.Commands.RemoveMaintenanceRequestDigitalAsset;

[OfficeOnly]
public class RemoveMaintenanceRequestDigitalAssetRequest : IRequest<RemoveMaintenanceRequestDigitalAssetResponse>
{
    public Guid MaintenanceRequestDigitalAssetId { get; set; }
}
