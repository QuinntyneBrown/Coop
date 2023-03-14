using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features;

public class RemoveMaintenanceRequestCommentRequest : IRequest<RemoveMaintenanceRequestCommentResponse>
{
    public Guid MaintenanceRequestCommentId { get; set; }
}
public class RemoveMaintenanceRequestCommentResponse : ResponseBase
{
    public MaintenanceRequestCommentDto MaintenanceRequestComment { get; set; }
}
public class RemoveMaintenanceRequestCommentHandler : IRequestHandler<RemoveMaintenanceRequestCommentRequest, RemoveMaintenanceRequestCommentResponse>
{
    private readonly ICoopDbContext _context;
    public RemoveMaintenanceRequestCommentHandler(ICoopDbContext context)
        => _context = context;
    public async Task<RemoveMaintenanceRequestCommentResponse> Handle(RemoveMaintenanceRequestCommentRequest request, CancellationToken cancellationToken)
    {
        var maintenanceRequestComment = await _context.MaintenanceRequestComments.SingleAsync(x => x.MaintenanceRequestCommentId == request.MaintenanceRequestCommentId);
        _context.MaintenanceRequestComments.Remove(maintenanceRequestComment);
        await _context.SaveChangesAsync(cancellationToken);
        return new RemoveMaintenanceRequestCommentResponse()
        {
            MaintenanceRequestComment = maintenanceRequestComment.ToDto()
        };
    }
}
