using MediatR;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestCommentsPage;

public class GetMaintenanceRequestCommentsPageRequest : IRequest<GetMaintenanceRequestCommentsPageResponse>
{
    public int PageSize { get; set; } = 10;
    public int Index { get; set; } = 0;
}
