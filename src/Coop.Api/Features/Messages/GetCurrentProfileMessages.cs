using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;

namespace Coop.Api.Features
{
    public class GetCurrentProfileMessages
    {
        public class Request: IRequest<Response> { }

        public class Response: ResponseBase
        {
            public List<MessageDto> Messages { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
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

                var profile = await _context.Profiles.FindAsync(user.CurrentProfileId);

                return new () {
                    Messages = await _context.Messages
                    .Where(x => x.ToProfileId == profile.ProfileId || x.FromProfileId == profile.ProfileId)
                    .OrderByDescending(x => x.Created)
                    .Select(x => x.ToDto()).ToListAsync()
                };
            }
            
        }
    }
}
