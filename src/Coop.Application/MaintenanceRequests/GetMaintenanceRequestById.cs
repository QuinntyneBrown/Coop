using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features
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
                    MaintenanceRequest = (await _context.MaintenanceRequests
                    .Include(x => x.DigitalAssets)
                    .SingleOrDefaultAsync(x => x.MaintenanceRequestId == request.MaintenanceRequestId)).ToDto()
                };
            }

        }
    }
}
