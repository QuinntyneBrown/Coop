using Coop.Api.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class GetPublishedByLaws
    {
        public class Request : IRequest<Response> { }

        public class Response
        {
            public List<ByLawDto> ByLaws { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context){
                _context = context;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken) {
			    return new () { 
                    ByLaws = await _context.ByLaws
                    .Where(x => x.Published.HasValue)
                    .Select(x => x.ToDto()).ToListAsync()
                };
            }
        }
    }
}
