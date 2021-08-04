using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetMaintenanceRequestById
    {
        public class Request : IRequest<Response>
        {
            public Guid MaintenanceRequestId { get; set; }
        }

        public class Response : ResponseBase
        {
            public MaintenanceRequestDto MaintenanceRequest { get; set; }
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
                    MaintenanceRequest = (await _context.MaintenanceRequests.SingleOrDefaultAsync(x => x.MaintenanceRequestId == request.MaintenanceRequestId)).ToDto()
                };
            }

        }
    }
}
