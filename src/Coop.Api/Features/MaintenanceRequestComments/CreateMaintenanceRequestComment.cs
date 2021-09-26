using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Core.Models;
using Coop.Core;
using Coop.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using Coop.Core;

namespace Coop.Api.Features
{
    public class CreateMaintenanceRequestComment
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.MaintenanceRequestComment).NotNull();
                RuleFor(request => request.MaintenanceRequestComment).SetValidator(new MaintenanceRequestCommentValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public MaintenanceRequestCommentDto MaintenanceRequestComment { get; set; }
        }

        public class Response : ResponseBase
        {
            public MaintenanceRequestCommentDto MaintenanceRequestComment { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;

            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
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
    }
}
