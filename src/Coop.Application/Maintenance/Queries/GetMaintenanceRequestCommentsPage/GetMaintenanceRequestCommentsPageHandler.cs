using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestCommentsPage;

public class GetMaintenanceRequestCommentsPageHandler : IRequestHandler<GetMaintenanceRequestCommentsPageRequest, GetMaintenanceRequestCommentsPageResponse>
{
    private readonly ICoopDbContext _context;

    public GetMaintenanceRequestCommentsPageHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetMaintenanceRequestCommentsPageResponse> Handle(GetMaintenanceRequestCommentsPageRequest request, CancellationToken cancellationToken)
    {
        var query = _context.MaintenanceRequestComments.Where(c => !c.IsDeleted);
        var totalCount = await query.CountAsync(cancellationToken);
        var comments = await query.Skip(request.Index * request.PageSize).Take(request.PageSize).ToListAsync(cancellationToken);
        return new GetMaintenanceRequestCommentsPageResponse
        {
            MaintenanceRequestComments = comments.Select(MaintenanceRequestCommentDto.FromComment).ToList(),
            TotalCount = totalCount, PageSize = request.PageSize, PageIndex = request.Index
        };
    }
}
