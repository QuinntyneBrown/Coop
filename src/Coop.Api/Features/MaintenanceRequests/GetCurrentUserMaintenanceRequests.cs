using Coop.Api.Core;
using Coop.Api.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class GetCurrentUserMaintenanceRequests
    {
        public class Request : IRequest<Response> {   }

        public class Response
        {
            public List<MaintenanceRequestDto> MaintenanceRequests { get; set; }
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

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken) {
                var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);

                return new () { 
                    MaintenanceRequests = _context.MaintenanceRequests
                    .Where(x => x.CreatedById == userId)
                    .Select(x => x.ToDto()).ToList()
                };
            }
        }
    }
}
