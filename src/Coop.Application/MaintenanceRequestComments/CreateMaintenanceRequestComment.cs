using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using Coop.Domain;

namespace Coop.Application.Features;

public class Validator : AbstractValidator<Request>
{
    public Validator()
    {
        RuleFor(request => request.MaintenanceRequestComment).NotNull();
        RuleFor(request => request.MaintenanceRequestComment).SetValidator(new MaintenanceRequestCommentValidator());
    }
}
public class CreateMaintenanceRequestCommentRequest : IRequest<CreateMaintenanceRequestCommentResponse>
{
    public MaintenanceRequestCommentDto MaintenanceRequestComment { get; set; }
}
public class CreateMaintenanceRequestCommentResponse : ResponseBase
{
    public MaintenanceRequestCommentDto MaintenanceRequestComment { get; set; }
}
public class CreateMaintenanceRequestCommentHandler : IRequestHandler<CreateMaintenanceRequestCommentRequest, CreateMaintenanceRequestCommentResponse>
{
    private readonly ICoopDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public CreateMaintenanceRequestCommentHandler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }
    public async Task<CreateMaintenanceRequestCommentResponse> Handle(CreateMaintenanceRequestCommentRequest request, CancellationToken cancellationToken)
    {
        var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);
        var maintenanceRequestComment = new MaintenanceRequestComment(
            request.MaintenanceRequestComment.MaintenanceRequestId,
            request.MaintenanceRequestComment.Body,
            userId
            );
        _context.MaintenanceRequestComments.Add(maintenanceRequestComment);
        await _context.SaveChangesAsync(cancellationToken);
        return new()
        {
            MaintenanceRequestComment = maintenanceRequestComment.ToDto()
        };
    }
}
