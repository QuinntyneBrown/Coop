using Coop.Api.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class GetPublishedNotices
    {
        public class Request : IRequest<Response> { }

        public class Response
        {
            public List<NoticeDto> Notices { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context){
                _context = context;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken) {
			    return new () { 
                    Notices = await _context.Notices
                    .Where(x => x.Published.HasValue)
                    .Select(x => x.ToDto()).ToListAsync()
                };
            }
        }
    }
}
