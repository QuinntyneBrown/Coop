using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestComments;

public class GetMaintenanceRequestCommentsHandler : IRequestHandler<GetMaintenanceRequestCommentsRequest, GetMaintenanceRequestCommentsResponse>
{
    private readonly ICoopDbContext _context;

    public GetMaintenanceRequestCommentsHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetMaintenanceRequestCommentsResponse> Handle(GetMaintenanceRequestCommentsRequest request, CancellationToken cancellationToken)
    {
        var comments = await _context.MaintenanceRequestComments.Where(c => !c.IsDeleted).ToListAsync(cancellationToken);
        return new GetMaintenanceRequestCommentsResponse { MaintenanceRequestComments = comments.Select(MaintenanceRequestCommentDto.FromComment).ToList() };
    }
}
