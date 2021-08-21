using Coop.Api.Core;
using Coop.Api.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class GetCurrentProfileCssCustomProperties
    {
        public class Request : IRequest<Response> { }

        public class Response
        {
            public List<ProfileCssCustomPropertyDto> CssCustomProperties { get; set; }
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

                var cssCustomProperties = await _context.ProfileCssCustomProperties
                    .Where(x => x.ProfileId == user.CurrentProfileId)
                    .Select(x => x.ToDto())
                    .ToListAsync();

                return new()
                {
                    CssCustomProperties = cssCustomProperties
                };
            }
        }
    }
}
