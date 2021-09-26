using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Core.Models;
using Coop.Core;
using Coop.Core.Interfaces;

namespace Coop.Api.Features
{
    public class CreateByLaw
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.ByLaw).NotNull();
                RuleFor(request => request.ByLaw).SetValidator(new ByLawValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public ByLawDto ByLaw { get; set; }
        }

        public class Response : ResponseBase
        {
            public ByLawDto ByLaw { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var byLaw = new ByLaw(request.ByLaw.PdfDigitalAssetId, request.ByLaw.Name);

                _context.ByLaws.Add(byLaw);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    ByLaw = byLaw.ToDto()
                };
            }

        }
    }
}
