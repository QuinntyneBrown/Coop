using MediatR;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestPhoto;

public class GetMaintenanceRequestPhotoRequest : IRequest<GetMaintenanceRequestPhotoResponse>
{
    public Guid MaintenanceRequestId { get; set; }
    public Guid PhotoId { get; set; }
}
