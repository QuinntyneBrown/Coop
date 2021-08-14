using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Coop.Api.Core;
using Coop.Api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Coop.Api.Features
{
    public class GetConversationById
    {
        public class Request: IRequest<Response>
        {
            public Guid ConversationId { get; set; }
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
                return new () {
                    Conversation = (await _context.Conversations.SingleOrDefaultAsync(x => x.ConversationId == request.ConversationId)).ToDto()
                };
            }
            
        }
    }
}
