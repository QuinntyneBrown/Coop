using Coop.Api.Core;
using Coop.Api.Interfaces;
using Coop.Api.Models;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class CurrentUser
    {
        public class Request : IRequest<Response> { }

        public class Response
        {
            public UserDto User { get; set; }
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

                User user = _context.Users
                    .Include(x => x.Profiles)
                    .Include(x => x.Roles)
                    .ThenInclude(x => x.Privileges)
                    .Single(x => x.UserId == userId);

                return new()
                {
                    User = user.ToDto()
                };
            }
        }
    }
}
