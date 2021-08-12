using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class RemoveReport
    {
        public class Request : IRequest<Response>
        {
            public Guid ReportId { get; set; }
        }

        public class Response : ResponseBase
        {
            public ReportDto Report { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var report = await _context.Reports.SingleAsync(x => x.ReportId == request.ReportId);

                _context.Reports.Remove(report);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    Report = report.ToDto()
                };
            }

        }
    }
}
