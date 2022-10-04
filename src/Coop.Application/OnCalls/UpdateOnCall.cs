using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain;
using Coop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Application.Features
{
    public class UpdateOnCall
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.OnCall).NotNull();
                RuleFor(request => request.OnCall).SetValidator(new OnCallValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public OnCallDto OnCall { get; set; }
        }

        public class Response : ResponseBase
        {
            public OnCallDto OnCall { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var onCall = await _context.OnCalls.SingleAsync(x => x.OnCallId == request.OnCall.OnCallId);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    OnCall = onCall.ToDto()
                };
            }

        }
    }
}
