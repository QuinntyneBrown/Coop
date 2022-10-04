using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features
{
    public class UpdateReport
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Report).NotNull();
                RuleFor(request => request.Report).SetValidator(new ReportValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public ReportDto Report { get; set; }
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
                var report = await _context.Reports.SingleAsync(x => x.ReportId == request.Report.ReportId);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    Report = report.ToDto()
                };
            }

        }
    }
}