using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetByLawById
    {
        public class Request: IRequest<Response>
        {
            public Guid ByLawId { get; set; }
        }

        public class Response: ResponseBase
        {
            public ByLawDto ByLaw { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                return new () {
                    ByLaw = (await _context.ByLaws.SingleOrDefaultAsync(x => x.ByLawId == request.ByLawId)).ToDto()
                };
            }
            
        }
    }
}
