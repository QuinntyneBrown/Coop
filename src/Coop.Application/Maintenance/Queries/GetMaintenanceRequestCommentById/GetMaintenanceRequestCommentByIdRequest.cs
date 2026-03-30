using MediatR;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestCommentById;

public class GetMaintenanceRequestCommentByIdRequest : IRequest<GetMaintenanceRequestCommentByIdResponse>
{
    public Guid MaintenanceRequestCommentId { get; set; }
}
