using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using Coop.Api.Models;
using Coop.Api.Core;
using Coop.Api.Interfaces;

namespace Coop.Api.Features
{
    public class RemoveConversation
    {
        public class Request : IRequest<Response>
        {
            public Guid ConversationId { get; set; }
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
                var conversation = await _context.Conversations.SingleAsync(x => x.ConversationId == request.ConversationId);

                _context.Conversations.Remove(conversation);

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    Conversation = conversation.ToDto()
                };
            }

        }
    }
}
