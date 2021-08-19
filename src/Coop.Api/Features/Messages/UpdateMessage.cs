using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class UpdateMessage
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Message).NotNull();
                RuleFor(request => request.Message).SetValidator(new MessageValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public MessageDto Message { get; set; }
        }

        public class Response : ResponseBase
        {
            public MessageDto Message { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var message = await _context.Messages.SingleAsync(x => x.MessageId == request.Message.MessageId);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    Message = message.ToDto()
                };
            }

        }
    }
}
