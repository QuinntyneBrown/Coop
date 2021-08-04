using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class UpdateByLaw
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
                var byLaw = await _context.ByLaws.SingleAsync(x => x.ByLawId == request.ByLaw.ByLawId);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    ByLaw = byLaw.ToDto()
                };
            }

        }
    }
}
