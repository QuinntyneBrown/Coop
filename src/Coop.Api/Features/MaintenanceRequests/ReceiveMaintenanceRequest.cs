using Coop.Core;
using Coop.Core.Interfaces;
using Coop.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class ReceiveMaintenanceRequest
    {
        public class Request : Coop.Core.DomainEvents.ReceiveMaintenanceRequest, IRequest<Response>
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
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(ICoopDbContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {

                var maintenanceRequest = await _context.MaintenanceRequests.SingleAsync(x => x.MaintenanceRequestId == request.MaintenanceRequestId);

                var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);

                var user = await _context.Users.FindAsync(userId);

                request.ReceivedByProfileId = user.CurrentProfileId;

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
