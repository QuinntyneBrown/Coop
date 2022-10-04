using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Domain.Entities;
using Coop.Domain;
using Coop.Domain.Interfaces;

namespace Coop.Application.Features
{
    public class CreateConversation
    {
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Conversation).NotNull();
                RuleFor(request => request.Conversation).SetValidator(new ConversationValidator());
            }

        }

        public class Request : IRequest<Response>
        {
            public ConversationDto Conversation { get; set; }
        }

        public class Response : ResponseBase
        {
            public ConversationDto Conversation { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;

            public Handler(ICoopDbContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var conversation = new Conversation();

                _context.Conversations.Add(conversation);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    Conversation = conversation.ToDto()
                };
            }

        }
    }
}
