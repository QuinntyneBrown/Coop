using Coop.Core;
using Coop.Core.Interfaces;
using Coop.Core;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class CurrentProfile
    {
        public class Request : IRequest<Response> { }

        public class Response
        {
            public dynamic Profile { get; set; }
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

                if (!_httpContextAccessor.HttpContext.User.Identity.IsAuthenticated)
                {
                    return new();
                }

                var userId = new Guid(_httpContextAccessor.HttpContext.User.FindFirst(Constants.ClaimTypes.UserId).Value);

                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                {
                    return new();
                }

                var profile = await _context.Profiles.FindAsync(user.CurrentProfileId);

                return new()
                {
                    Profile = profile.ToDto()
                };
            }
        }
    }
}
