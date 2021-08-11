using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetReportById
    {
        public class Request: IRequest<Response>
        {
            public Guid ReportId { get; set; }
        }

        public class Response: ResponseBase
        {
            public ReportDto Report { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                return new () {
                    Report = (await _context.Reports.SingleOrDefaultAsync(x => x.ReportId == request.ReportId)).ToDto()
                };
            }
            
        }
    }
}
