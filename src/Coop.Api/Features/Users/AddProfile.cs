using Coop.Api.Core;
using Coop.Api.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class AddProfile
    {
        public class Request : IRequest<Response>
        {
            public Guid UserId { get; set; }
            public Guid ProfileId { get; set; }

            public void Deconstruct(out Guid userId, out Guid profileId)
            {
                userId = UserId;
                profileId = ProfileId;
            }
        }

        public class Response
        {
            public UserDto User { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
            private readonly IMessageHandlerContext _messageHandlerContext;

            public Handler(ICoopDbContext context, IMessageHandlerContext messageHandlerContext)
            {
                _context = context;
                _messageHandlerContext = messageHandlerContext;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {

                var (userId, profileId) = request;

                var user = await _context.Users.Include(x => x.Profiles).SingleAsync(x => x.UserId == userId);

                var profile = await _context.Profiles.SingleAsync(x => x.ProfileId == profileId);

                user.AddProfile(profile);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    User = user.ToDto()
                };
            }

        }
    }
}
