using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Core.Models;
using Coop.Core;
using Coop.Core.Interfaces;

namespace Coop.Api.Features
{
    public class CreateReport
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
                var report = new Report(request.Report.PdfDigitalAssetId, request.Report.Name);

                _context.Reports.Add(report);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    Report = report.ToDto()
                };
            }

        }
    }
}
