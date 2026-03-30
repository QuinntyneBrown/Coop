using Coop.Application.Common.Interfaces;
using Coop.Application.Maintenance.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Maintenance.Queries.GetMaintenanceRequestCommentById;

public class GetMaintenanceRequestCommentByIdHandler : IRequestHandler<GetMaintenanceRequestCommentByIdRequest, GetMaintenanceRequestCommentByIdResponse>
{
    private readonly ICoopDbContext _context;

    public GetMaintenanceRequestCommentByIdHandler(ICoopDbContext context)
    {
        _context = context;
    }

    public async Task<GetMaintenanceRequestCommentByIdResponse> Handle(GetMaintenanceRequestCommentByIdRequest request, CancellationToken cancellationToken)
    {
        var c = await _context.MaintenanceRequestComments.SingleAsync(x => x.MaintenanceRequestCommentId == request.MaintenanceRequestCommentId, cancellationToken);
        return new GetMaintenanceRequestCommentByIdResponse { MaintenanceRequestComment = MaintenanceRequestCommentDto.FromComment(c) };
    }
}
