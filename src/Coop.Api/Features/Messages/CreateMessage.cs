using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class CreateMessage
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
                var message = new Message(request.Message.ConversationId, request.Message.ToProfileId, request.Message.FromProfileId, request.Message.Body);

                _context.Messages.Add(message);

                await _context.SaveChangesAsync(cancellationToken);

                return new()
                {
                    Message = message.ToDto()
                };
            }

        }
    }
}
