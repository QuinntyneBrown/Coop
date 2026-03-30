using MediatR;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestDigitalAssetById;

public class GetMaintenanceRequestDigitalAssetByIdRequest : IRequest<GetMaintenanceRequestDigitalAssetByIdResponse>
{
    public Guid MaintenanceRequestDigitalAssetId { get; set; }
}
