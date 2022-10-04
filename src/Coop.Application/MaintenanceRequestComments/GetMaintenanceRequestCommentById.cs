using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features
{
    public class GetMaintenanceRequestCommentById
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
                return new()
                {
                    MaintenanceRequestComment = (await _context.MaintenanceRequestComments.SingleOrDefaultAsync(x => x.MaintenanceRequestCommentId == request.MaintenanceRequestCommentId)).ToDto()
                };
            }

        }
    }
}