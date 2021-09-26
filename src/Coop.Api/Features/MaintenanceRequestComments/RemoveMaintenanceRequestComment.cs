using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Core.Models;
using Coop.Core;
using Coop.Core.Interfaces;

namespace Coop.Api.Features
{
    public class RemoveMaintenanceRequestComment
    {
        public class Request : IRequest<Response>
        {
            public Guid MaintenanceRequestCommentId { get; set; }
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
                var maintenanceRequestComment = await _context.MaintenanceRequestComments.SingleAsync(x => x.MaintenanceRequestCommentId == request.MaintenanceRequestCommentId);

                _context.MaintenanceRequestComments.Remove(maintenanceRequestComment);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    MaintenanceRequestComment = maintenanceRequestComment.ToDto()
                };
            }

        }
    }
}
