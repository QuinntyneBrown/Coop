using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class UpdateConversation
    {
        public class Validator: AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Conversation).NotNull();
                RuleFor(request => request.Conversation).SetValidator(new ConversationValidator());
            }
        
        }

        public class Request: IRequest<Response>
        {
            public ConversationDto Conversation { get; set; }
        }

        public class Response: ResponseBase
        {
            public ConversationDto Conversation { get; set; }
        }

        public class Handler: IRequestHandler<Request, Response>
        {
            private readonly ICoopDbContext _context;
        
            public Handler(ICoopDbContext context)
                => _context = context;
        
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var conversation = await _context.Conversations.SingleAsync(x => x.ConversationId == request.Conversation.ConversationId);
                
                await _context.SaveChangesAsync(cancellationToken);
                
                return new Response()
                {
                    Conversation = conversation.ToDto()
                };
            }
            
        }
    }
}
