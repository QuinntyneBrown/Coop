using Coop.Domain;
using Coop.Domain.Interfaces;
using Coop.Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Application.Features
{
    public class GetCurrentUserMaintenanceRequests
    {
        public class Request : IRequest<Response> { }

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

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);

                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                {
                    return new();
                }

                var profile = await _context.Profiles.FindAsync(user.CurrentProfileId);

                return new()
                {
                    MaintenanceRequests = _context.MaintenanceRequests
                    .Include(x => x.DigitalAssets)
                    .Where(x => x.RequestedByProfileId == profile.ProfileId)
                    .Select(x => x.ToDto()).ToList()
                };
            }
        }
    }
}
