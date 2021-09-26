using Coop.Core.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Coop.Api.Features
{
    public class GetPublishedReports
    {
        public class Request : IRequest<Response> { }

        public class Response
        {
            public List<ReportDto> Reports { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
            {
                _context = context;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                return new()
                {
                    Reports = await _context
                    .Reports.Where(x => x.Published.HasValue)
                    .Select(x => x.ToDto())
                    .ToListAsync()
                };
            }
        }
    }
}
