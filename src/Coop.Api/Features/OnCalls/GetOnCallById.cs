using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetOnCallById
    {
        public class Request: IRequest<Response>
        {
            public Guid OnCallId { get; set; }
        }

        public class Response: ResponseBase
        {
            public OnCallDto OnCall { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                return new () {
                    OnCall = (await _context.OnCalls.SingleOrDefaultAsync(x => x.OnCallId == request.OnCallId)).ToDto()
                };
            }
            
        }
    }
}
