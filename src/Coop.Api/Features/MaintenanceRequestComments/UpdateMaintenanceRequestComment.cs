using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class UpdateMaintenanceRequestComment
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

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var maintenanceRequestComment = await _context.MaintenanceRequestComments.SingleAsync(x => x.MaintenanceRequestCommentId == request.MaintenanceRequestComment.MaintenanceRequestCommentId);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    MaintenanceRequestComment = maintenanceRequestComment.ToDto()
                };
            }

        }
    }
}
