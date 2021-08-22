using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetFragmentById
    {
        public class Request: IRequest<Response>
        {
            public Guid FragmentId { get; set; }
        }

        public class Response: ResponseBase
        {
            public FragmentDto Fragment { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                return new () {
                    Fragment = (await _context.Fragments.SingleOrDefaultAsync(x => x.FragmentId == request.FragmentId)).ToDto()
                };
            }
            
        }
    }
}
