using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetMaintenanceRequestCommentByIdRequest : IRequest<GetMaintenanceRequestCommentByIdResponse>
{
    public Guid MaintenanceRequestCommentId { get; set; }
}
public class GetMaintenanceRequestCommentByIdResponse : ResponseBase
{
    public MaintenanceRequestCommentDto MaintenanceRequestComment { get; set; }
}
public class GetMaintenanceRequestCommentByIdHandler : IRequestHandler<GetMaintenanceRequestCommentByIdRequest, GetMaintenanceRequestCommentByIdResponse>
{
    private readonly ICoopDbContext _context;
    public GetMaintenanceRequestCommentByIdHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetMaintenanceRequestCommentByIdResponse> Handle(GetMaintenanceRequestCommentByIdRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            MaintenanceRequestComment = (await _context.MaintenanceRequestComments.SingleOrDefaultAsync(x => x.MaintenanceRequestCommentId == request.MaintenanceRequestCommentId)).ToDto()
        };
    }
}
