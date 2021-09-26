using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Core.Models;
using Coop.Core;
using Coop.Core.Interfaces;

namespace Coop.Api.Features
{
    public class CreateStoredEvent
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.StoredEvent).NotNull();
                RuleFor(request => request.StoredEvent).SetValidator(new StoredEventValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public StoredEventDto StoredEvent { get; set; }
        }

        public class Response : ResponseBase
        {
            public StoredEventDto StoredEvent { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var storedEvent = new StoredEvent();

                _context.StoredEvents.Add(storedEvent);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    StoredEvent = storedEvent.ToDto()
                };
            }

        }
    }
}
