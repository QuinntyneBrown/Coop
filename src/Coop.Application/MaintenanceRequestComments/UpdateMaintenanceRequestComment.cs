using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.MaintenanceRequestComment).NotNull();
        RuleFor(request => request.MaintenanceRequestComment).SetValidator(new MaintenanceRequestCommentValidator());
    }
}
public class UpdateMaintenanceRequestCommentRequest : IRequest<UpdateMaintenanceRequestCommentResponse>
{
    public MaintenanceRequestCommentDto MaintenanceRequestComment { get; set; }
}
public class UpdateMaintenanceRequestCommentResponse : ResponseBase
{
    public MaintenanceRequestCommentDto MaintenanceRequestComment { get; set; }
}
public class UpdateMaintenanceRequestCommentHandler : IRequestHandler<UpdateMaintenanceRequestCommentRequest, UpdateMaintenanceRequestCommentResponse>
{
    private readonly ICoopDbContext _context;
    public UpdateMaintenanceRequestCommentHandler(ICoopDbContext context)
        => _context = context;
    public async Task<UpdateMaintenanceRequestCommentResponse> Handle(UpdateMaintenanceRequestCommentRequest request, CancellationToken cancellationToken)
    {
        var maintenanceRequestComment = await _context.MaintenanceRequestComments.SingleAsync(x => x.MaintenanceRequestCommentId == request.MaintenanceRequestComment.MaintenanceRequestCommentId);
        await _context.SaveChangesAsync(cancellationToken);
        return new UpdateMaintenanceRequestCommentResponse()
        {
            MaintenanceRequestComment = maintenanceRequestComment.ToDto()
        };
    }
}
