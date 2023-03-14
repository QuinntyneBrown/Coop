using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class GetMaintenanceRequestCommentsRequest : IRequest<GetMaintenanceRequestCommentsResponse> { }
public class GetMaintenanceRequestCommentsResponse : ResponseBase
{
    public List<MaintenanceRequestCommentDto> MaintenanceRequestComments { get; set; }
}
public class GetMaintenanceRequestCommentsHandler : IRequestHandler<GetMaintenanceRequestCommentsRequest, GetMaintenanceRequestCommentsResponse>
{
    private readonly ICoopDbContext _context;
    public GetMaintenanceRequestCommentsHandler(ICoopDbContext context)
        => _context = context;
    public async Task<GetMaintenanceRequestCommentsResponse> Handle(GetMaintenanceRequestCommentsRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            MaintenanceRequestComments = await _context.MaintenanceRequestComments.Select(x => x.ToDto()).ToListAsync()
        };
    }
}
