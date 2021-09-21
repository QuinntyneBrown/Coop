using Coop.Api.Core;
using Coop.Api.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class UpdateInvitationTokenExpiry
    {
        public class Request: IRequest<Response>
        {
            public Guid InvitationTokenId { get; set; }
            public DateTime? Expiry { get; set; }
        }

        public class Response: ResponseBase
        {
            public InvitationTokenDto InvitationToken { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var invitationToken = await _context.InvitationTokens.SingleAsync(x => x.InvitationTokenId == request.InvitationTokenId);

                invitationToken.UpdateExpiry(request.Expiry);

                await _context.SaveChangesAsync(cancellationToken);
                
                return new ()
                {
                    InvitationToken = invitationToken.ToDto()
                };
            }
            
        }
    }
}
