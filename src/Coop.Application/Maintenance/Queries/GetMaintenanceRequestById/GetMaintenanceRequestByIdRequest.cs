using MediatR;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestById;

public class GetMaintenanceRequestByIdRequest : IRequest<GetMaintenanceRequestByIdResponse>
{
    public Guid MaintenanceRequestId { get; set; }
}
