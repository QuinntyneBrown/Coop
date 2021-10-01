using Coop.Core.Interfaces;
using Coop.Core.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class StartMaintenanceRequest
    {
        public class Request : Coop.Core.DomainEvents.StartMaintenanceRequest, IRequest<Response>
        {
            public Guid MaintenanceRequestId { get; set; }
        }

        public class Response
        {
            public MaintenanceRequestDto MaintenanceRequest { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
            {
                _context = context;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {

                var maintenanceRequest = await _context.MaintenanceRequests.SingleAsync(x => x.MaintenanceRequestId == request.MaintenanceRequestId);

                maintenanceRequest.Apply(request);

                await _context.SaveChangesAsync(default);

                return new()
                {
                    MaintenanceRequest = maintenanceRequest.ToDto()
                };
            }
        }
    }
}
